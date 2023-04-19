import Link from 'next/link';

export interface INavItemProps {
    url: string,
    children?: string | undefined
}

export default function NavItem(props: INavItemProps) {
    return (
        <Link href={props.url} scroll={false} title={props.children} className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            {props.children}
        </Link>
    );
}
