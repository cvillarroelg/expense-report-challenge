import Navbar from "../components/Navbar";

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AppLayout;
