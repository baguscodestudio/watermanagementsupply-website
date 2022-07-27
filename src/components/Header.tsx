import { Bell } from 'styled-icons/bootstrap';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="w-full h-[10vh] shadow-lg inline-flex items-center bg-white">
      <span className="ml-12 text-3xl font-semibold">{title}</span>
      <Bell size="24" className="ml-auto mr-12" />
    </header>
  );
};

export default Header;
