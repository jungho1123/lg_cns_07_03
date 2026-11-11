
import Link from "next/link";

const menuItems = [
  {
    name: "대시보드",
    href: "/dashboard",
  },
  {
    name: "서비스 소개",
    href: "/",
  },
];

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="navigation-inner">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="navigation-item"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
