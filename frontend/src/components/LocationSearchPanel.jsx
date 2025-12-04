import React from 'react';
import { useDebounce } from "./useDebounce";
import { set } from 'react-hook-form';
import axios from 'axios';
const LocationSearchPanel = ({
    setPanelOpen,
    setVehiclePanel,
    pickUp,
    setPickUp,
    panelOpen,
    selectedAddress,
    setSelectedAddress,
    destination,
    setDestination,
    selectedDestination,
    setSelectedDestination,
    findTrip
}) => {


    const [addresses, setAddresses] = React.useState([]);
    const [skipFetch, setSkipFetch] = React.useState(false);
    // const [destination, setDestination] = React.useState('');
    const [destinationSuggestions, setDestinationSuggestions] = React.useState([]);
    const [skipDestinationFetch, setSkipDestinationFetch] = React.useState(false);

    const handleSelect = (address) => {
        setPickUp(address.name);
        setSelectedAddress(address.name);
        setAddresses([]);        // hide suggestions
        setSkipFetch(true);      // prevent fetch from effect
    }

    // debounce pickup value (wait 600ms after typing stops)
    const debouncedPickUp = useDebounce(pickUp, 600);
    const debouncedDestination = useDebounce(destination, 600);
    React.useEffect(() => {
        if (panelOpen && debouncedDestination.length > 3) {
            if (skipDestinationFetch) {
                setSkipDestinationFetch(false); // reset flag
                return;
            }

            const getSuggestions = async () => {
                const suggestions = await fetchLocationSuggestions(debouncedDestination);
                console.log('Destination suggestions:', suggestions);
                setDestinationSuggestions(suggestions || []);
                setAddresses(suggestions || []);
            };

            getSuggestions();
        } else {
            setDestinationSuggestions([]);
        }
    }, [panelOpen, debouncedDestination]);
    const handleDestinationSelect = (address) => {
        setDestination(address.name);
        setSelectedDestination(address.name);   // optional if you track a single selected address
        setDestinationSuggestions([]);      // hide suggestions
        setSkipDestinationFetch(true);      // prevent effect API call
    }

    const fetchLocationSuggestions = async (input) => {
        try {
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
             const response = await axios.get(
      `http://localhost:5000/maps/get-suggestions?input=${encodeURIComponent(input)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        // withCredentials: true // optional: include cookies if present
      }
    );
            // const data = await response.json();
            // console.log(data.data.suggestions);
            // return data.data.suggestions || [];
             // Axios automatically parses JSON
    console.log(response.data.data.suggestions);

    return response.data.data.suggestions || [];
        } catch (err) {
            console.log(err);
        }
    }

    // const addresses = [
    //     {
    //         title: 'Kempegowda International Airport...',
    //         details: 'KIAL Rd, Devanahalli, Bengaluru, Karnataka'
    //     },
    //     {
    //         title: 'Kempegowda International Airport...',
    //         details: 'KIAL Rd, Devanahalli, Bengaluru, Karnataka'
    //     },
    //     // Add more addresses here if needed
    // ];
    React.useEffect(() => {
        if (panelOpen && debouncedPickUp.length > 3) {
            if (skipFetch) {
                setSkipFetch(false); // reset the flag
                return;              // skip this fetch
            }
            const getSuggestions = async () => {
                const suggestions = await fetchLocationSuggestions(debouncedPickUp); // 👈 use debounced value
                setAddresses(suggestions || []);
            }
            getSuggestions();
        } else {
            setAddresses([]); // clear suggestions if panel closed or input too short
        }
    }, [panelOpen, debouncedPickUp]); // ✅ only these deps

    return (
        <div className='w-full h-fit flex flex-col gap-3 p-4'>
            {/* 2️⃣ Map over the addresses array */}
            {addresses.map((address, index) => (
                <div
                    onClick={() => {
                        setSelectedAddress(address.name);
                        // setPickUp(address.name);
                        setAddresses([]);        // 👈 clear suggestions from UI
                        if (destination && debouncedDestination.length > 3) {
                            handleDestinationSelect(address);
                        }
                        else if (pickUp && debouncedPickUp.length > 3) {
                            handleSelect(address);
                        }
                        // setVehiclePanel(true)
                        // setPanelOpen(false)
                    }}
                    key={index}
                    className='w-full p-3 flex flex-row gap-5 items-center border-2 border-gray-200 active:border-black'
                >
                    <h1 className='w-7 h-6 rounded-full text-center bg-gray-200'>
                        <i className="ri-map-pin-line"></i>
                    </h1>
                    <div
                        className='w-full flex flex-col items-center'>
                        <h1 className='text-lmd font-semibold'>{address.name}</h1>
                        {/* <p className='text-md'>{address.details}</p> */}
                    </div>
                </div>
            ))}
            {selectedAddress && selectedDestination && (
                <button
                    className="w-full p-3 bg-blue-500 text-white rounded-md mt-4"
                    onClick={() => {
                        // Navigate to next step, for example using React Router
                        // e.g., navigate(`/next-step?pickup=${pickUp}&destination=${destination}`)
                        console.log("Navigate with:", { pickUp, destination });
                        findTrip()
                    }}
                >
                    Next
                </button>
            )}

        </div>
    );
};

export default LocationSearchPanel;
