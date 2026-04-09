import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const LINKS = [
  { label: 'About', url: 'https://example.com/about' },
  { label: 'Terms & Conditions', url: 'https://example.com/terms' },
  { label: 'Privacy Policy', url: 'https://example.com/privacy' },
] as const;

export function LegalLinksFooter() {
  async function openLink(url: string) {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }

  return (
    <View style={styles.footer}>
      {LINKS.map((link, index) => (
        <View key={link.label} style={styles.linkRow}>
          <Pressable onPress={() => openLink(link.url)}>
            <Text style={styles.linkText}>{link.label}</Text>
          </Pressable>
          {index < LINKS.length - 1 ? <Text style={styles.separator}>•</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: '#FAF8F5',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: '#6B7280',
    fontSize: 12,
    textDecorationLine: 'underline',
    marginHorizontal: 4,
  },
  separator: {
    color: '#9CA3AF',
    marginHorizontal: 2,
    fontSize: 12,
  },
});
