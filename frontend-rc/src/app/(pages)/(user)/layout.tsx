import BottomNavBar from '../../components/BottomNavBar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="pb-28">{children}</div>
      <BottomNavBar />
    </div>
  );
}
