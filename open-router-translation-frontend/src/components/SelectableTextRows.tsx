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

export default function SynchronizedLists({
  subtitles,
}: {
  subtitles: Subtitle[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const leftRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleSelect = (index: number) => {
    if (subtitles.length === 0) return;
    setSelectedIndex(index);
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
    <Box display="flex" gap={2} justifyContent="space-between"  sx={{ width: "100%" }}>
      {/* Left List */}
      <Paper sx={{ flex: 4, height: 400, overflow: "auto" }} ref={leftRef}>
        <Typography variant="subtitle1" align="center" sx={{ p: 1 }}>
          Original
        </Typography>
        <List>
          {subtitles.length > 0 ? (
            subtitles[0].chunks.map((chunk, index) => (
              <ListItemButton
                key={chunk.index}
                selected={selectedIndex === index}
                onClick={() => handleSelect(index)}
              >
                <ListItemText primary={chunk.originalText} />
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
        <List>
          {subtitles.length > 0 ? (
            subtitles[0].chunks.map((chunk, index) => (
              <ListItemButton
                key={chunk.index}
                selected={selectedIndex === index}
                onClick={() => handleSelect(index)}
              >
                <ListItemText
                  primary={`${chunk.startTime} - ${chunk.endTime} : ${chunk.index}`}
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
        <List>
          {subtitles.length > 0 ? (
            subtitles[0].chunks.map((chunk, index) => (
              <ListItemButton
                key={chunk.index}
                selected={selectedIndex === index}
                onClick={() => handleSelect(index)}
              >
                <ListItemText primary={chunk.translatedText} />
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
