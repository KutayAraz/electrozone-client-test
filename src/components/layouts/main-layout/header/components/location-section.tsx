import { ReactComponent as LocationPin } from "@assets/svg/location.svg";
type LocationSectionProps = {
    city: string | null;
    isSignedIn: boolean;
    onLocationClick: () => void;
}

export const LocationSection = ({ city, isSignedIn, onLocationClick }: LocationSectionProps) => (
    <div className="hidden sm:flex items-center px-6">
        <LocationPin width={28} height={28} className="mr-[4px] stroke-white" />
        {isSignedIn ? (
            <div className="text-left text-sm">
                <p>Delivering to:</p>
                <p>{city}</p>
            </div>
        ) : (
            <button onClick={onLocationClick} className="text-left">
                {city ? (
                    <div>
                        <p>Delivering to:</p>
                        <p>{city}</p>
                    </div>
                ) : (
                    <div>
                        <p>Hello,</p>
                        <p>Select your location</p>
                    </div>
                )}
            </button>
        )}
    </div>
);