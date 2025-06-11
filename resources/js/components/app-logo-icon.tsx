export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
return (
    <img
        {...props}
        src="/images/logo.svg"
        alt="Logo"
        className="w-200 bg-transparent"
    />
);
}
