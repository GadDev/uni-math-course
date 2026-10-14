import { useEffect, useState } from 'react';
import { Box, Button, Text, Theme } from '@radix-ui/themes';
import { copy, type Locale } from '../lib/i18n';

export default function ReadingNotice({ locale }: { locale: Locale }) {
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const text = copy[locale];
  return (
    <Theme
      className="reading-notice-theme"
      accentColor="gray"
      grayColor="gray"
      radius="none"
      appearance="light"
    >
      <Box className="reading-notice" p="5">
        <Text as="p" weight="bold" mb="2">
          {text.notice}
        </Text>
        <Text as="p" size="2" mb="4">
          {text.readingNotice}
        </Text>
        <Button
          variant="soft"
          disabled={!ready}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls="reading-guide"
        >
          {expanded ? text.hideGuide : text.showGuide}
        </Button>
        <Box id="reading-guide" mt="4" hidden={!expanded}>
          <Text as="p" size="2">
            {text.guide}
          </Text>
        </Box>
      </Box>
    </Theme>
  );
}
