export interface ActivityItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  badge: string;
  description: string;
}

export const activitiesData: ActivityItem[] = [
  {
    id: 'nss-volunteer',
    role: 'Volunteer',
    organization: 'National Service Scheme (NSS)',
    period: '2023 – 2025',
    badge: 'Social Initiative',
    description:
      'Participated in university community service initiatives, social welfare camps, environmental sustainability drives, and collaborative youth leadership programs.',
  },
];
