export function generateVCard(card: any): string {
  const nameParts = card.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${card.name}`,
    card.jobTitle ? `TITLE:${card.jobTitle}` : "",
    card.company ? `ORG:${card.company}` : "",
    card.bio ? `NOTE:${card.bio}` : "",
    `URL:https://vcard.app/u/${card.slug}`,
    "END:VCARD"
  ];

  return vcard.filter(Boolean).join("\n");
}
