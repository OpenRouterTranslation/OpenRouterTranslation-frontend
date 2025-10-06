import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { Subtitle } from "./Middle";

interface Props {
  subtitles: Subtitle[];
  onSelectRow?: (index: number) => void;
  selectedRowIndex?: number;
}

export default function SynchronizedLists({
                                            subtitles,
                                            onSelectRow,
                                            selectedRowIndex = -1,
                                          }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(selectedRowIndex);
  const leftRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedIndex(selectedRowIndex);
  }, [selectedRowIndex]);

  const handleSelect = (index: number) => {
    if (subtitles.length === 0) return;
    setSelectedIndex(index);
    onSelectRow?.(index);
    console.log("Selected row:", subtitles[0].chunks[index]);
  };

  // Synchronize scrolling for all 3 lists
  useEffect(() => {
    const leftEl = leftRef.current;
    const middleEl = middleRef.current;
    const rightEl = rightRef.current;
    if (!leftEl || !middleEl || !rightEl) return;

    const syncScroll = (source: HTMLDivElement, targets: HTMLDivElement[]) => {
      return () => {
        targets.forEach((t) => {
          if (t.scrollTop !== source.scrollTop) {
            t.scrollTop = source.scrollTop;
          }
        });
      };
    };

    const leftSync = syncScroll(leftEl, [middleEl, rightEl]);
    const middleSync = syncScroll(middleEl, [leftEl, rightEl]);
    const rightSync = syncScroll(rightEl, [leftEl, middleEl]);

    leftEl.addEventListener("scroll", leftSync);
    middleEl.addEventListener("scroll", middleSync);
    rightEl.addEventListener("scroll", rightSync);

    return () => {
      leftEl.removeEventListener("scroll", leftSync);
      middleEl.removeEventListener("scroll", middleSync);
      rightEl.removeEventListener("scroll", rightSync);
    };
  }, []);

  return (
      <Box display="flex" gap={2} justifyContent="space-between" sx={{ width: "100%" }}>
        {/* Left List */}
        <Paper sx={{ flex: 4, height: 400, overflow: "auto" }} ref={leftRef}>
          <Typography variant="subtitle1" align="center" sx={{ p: 1 }}>
            Original
          </Typography>
          <List disablePadding>
            {subtitles.length > 0 ? (
                subtitles[0].chunks.map((chunk, index) => (
                    <ListItemButton
                        key={chunk.index}
                        selected={selectedIndex === index}
                        onClick={() => handleSelect(index)}
                        sx={{
                          minHeight: 80,
                          maxHeight: 80,
                          alignItems: 'flex-start',
                          py: 1,
                          overflow: 'hidden'
                        }}
                    >
                      <ListItemText
                          primary={chunk.originalText}
                          primaryTypographyProps={{
                            sx: {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.5
                            }
                          }}
                      />
                    </ListItemButton>
                ))
            ) : (
                <Typography variant="body2" align="center" sx={{ p: 2 }}>
                  No subtitles available
                </Typography>
            )}
          </List>
        </Paper>

        {/* Middle List */}
        <Paper sx={{ flex: 2, height: 400, overflow: "auto" }} ref={middleRef}>
          <Typography variant="subtitle1" align="center" sx={{ p: 1 }}>
            Timecodes
          </Typography>
          <List disablePadding>
            {subtitles.length > 0 ? (
                subtitles[0].chunks.map((chunk, index) => (
                    <ListItemButton
                        key={chunk.index}
                        selected={selectedIndex === index}
                        onClick={() => handleSelect(index)}
                        sx={{
                          minHeight: 80,
                          maxHeight: 80,
                          alignItems: 'center',
                          py: 1
                        }}
                    >
                      <ListItemText
                          primary={`${chunk.startTime} - ${chunk.endTime}`}
                          secondary={`#${chunk.index}`}
                          primaryTypographyProps={{
                            sx: { fontSize: '0.875rem' }
                          }}
                          secondaryTypographyProps={{
                            sx: { fontSize: '0.75rem' }
                          }}
                      />
                    </ListItemButton>
                ))
            ) : (
                <Typography variant="body2" align="center" sx={{ p: 2 }}>
                  No subtitles available
                </Typography>
            )}
          </List>
        </Paper>

        {/* Right List */}
        <Paper sx={{ flex: 4, height: 400, overflow: "auto" }} ref={rightRef}>
          <Typography variant="subtitle1" align="center" sx={{ p: 1 }}>
            Translation
          </Typography>
          <List disablePadding>
            {subtitles.length > 0 ? (
                subtitles[0].chunks.map((chunk, index) => (
                    <ListItemButton
                        key={chunk.index}
                        selected={selectedIndex === index}
                        onClick={() => handleSelect(index)}
                        sx={{
                          minHeight: 80,
                          maxHeight: 80,
                          alignItems: 'flex-start',
                          py: 1,
                          overflow: 'hidden'
                        }}
                    >
                      <ListItemText
                          primary={chunk.translatedText || "(not translated)"}
                          primaryTypographyProps={{
                            sx: {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.5,
                              fontStyle: chunk.translatedText ? 'normal' : 'italic',
                              opacity: chunk.translatedText ? 1 : 0.6
                            }
                          }}
                      />
                    </ListItemButton>
                ))
            ) : (
                <Typography variant="body2" align="center" sx={{ p: 2 }}>
                  No subtitles available
                </Typography>
            )}
          </List>
        </Paper>
      </Box>
  );
}