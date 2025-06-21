import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="dark:bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-20 items-center justify-center rounded-md">
                <AppLogoIcon className="w-32 h-32 fill-current p-2" />
            </div>
        </>
    );
}