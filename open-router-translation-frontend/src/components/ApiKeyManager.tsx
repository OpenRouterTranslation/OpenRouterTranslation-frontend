import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Alert,
    Box,
    Typography,
    InputAdornment,
    Chip
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiKeyStorage } from '../services/apiKeyStorage';

export default function ApiKeyManager() {
    const [open, setOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [hasKey, setHasKey] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        checkApiKeyStatus();
    }, []);

    const checkApiKeyStatus = async () => {
        const exists = await apiKeyStorage.hasApiKey();
        setHasKey(exists);
    };

    const handleSaveKey = async () => {
        if (!apiKey.trim()) {
            setError('Please enter an API key');
            return;
        }

        // Basic validation for OpenRouter API key format
        if (!apiKey.startsWith('sk-or-')) {
            setError('Invalid API key format. OpenRouter keys start with "sk-or-"');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiKeyStorage.saveApiKey(apiKey.trim());
            setHasKey(true);
            setApiKey('');
            setOpen(false);
            alert('API key saved successfully and encrypted in your browser!');
        } catch (err) {
            console.error('Error saving API key:', err);
            setError('Failed to save API key. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteKey = async () => {
        if (!window.confirm('Are you sure you want to delete your API key?')) {
            return;
        }

        setLoading(true);
        try {
            await apiKeyStorage.deleteApiKey();
            setHasKey(false);
            alert('API key deleted successfully');
        } catch (err) {
            console.error('Error deleting API key:', err);
            alert('Failed to delete API key');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    onClick={() => setOpen(true)}
                    color="primary"
                    size="large"
                    title="Manage API Key"
                >
                    <SettingsIcon />
                </IconButton>
                {hasKey ? (
                    <Chip
                        label="API Key Set"
                        color="success"
                        size="small"
                        onDelete={handleDeleteKey}
                        deleteIcon={<DeleteIcon />}
                    />
                ) : (
                    <Chip
                        label="No API Key"
                        color="warning"
                        size="small"
                        onClick={() => setOpen(true)}
                    />
                )}
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    OpenRouter API Key Settings
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <strong>Development Mode:</strong> This application uses HTTP.
                            Your API key is encrypted in your browser but travels unencrypted over the network.
                            Only use in trusted local networks. Production deployment requires HTTPS.
                        </Alert>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            Your API key is encrypted and stored securely in your browser using Web Crypto API.
                            It never leaves your device except when making translation requests.
                        </Alert>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {hasKey ? (
                            <Box>
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    API key is currently set and active.
                                </Alert>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    You can update your key by entering a new one below, or delete it using the delete button above.
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Enter your OpenRouter API key to enable AI translations.
                                You can get one from{' '}
                                <a
                                    href="https://openrouter.ai/keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'inherit' }}
                                >
                                    openrouter.ai/keys
                                </a>
                            </Typography>
                        )}

                        <TextField
                            fullWidth
                            label="API Key"
                            type={showKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-or-v1-..."
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowKey(!showKey)}
                                            edge="end"
                                        >
                                            {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveKey}
                        variant="contained"
                        disabled={loading || !apiKey.trim()}
                    >
                        {loading ? 'Saving...' : hasKey ? 'Update Key' : 'Save Key'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}