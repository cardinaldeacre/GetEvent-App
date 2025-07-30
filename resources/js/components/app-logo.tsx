import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex w- items-center justify-center bg-indigo-700 rounded-sm py-1 px-2 text-sidebar-primary-foreground">
                <AppLogoIcon />
                <div className="ml-1 grid flex-1 text-left text-lg">
                    <span className="mb-0.5 truncate leading-tight font-semibold">GetEvent</span>
                </div>
            </div>
        </>
    );
}
