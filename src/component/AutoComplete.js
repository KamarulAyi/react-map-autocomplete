import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import throttle from 'lodash/throttle';
import { Skeleton, styled } from '@mui/material';
import {useDispatch} from 'react-redux';
import { addItem } from '../actions/mapActions';
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
  } from '@react-google-maps/api'
  import  {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  
const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#ffc83d',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#ffc83d',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: '#ffc83d',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ffc83d',
      },
    },
  });
const autocompleteService = { current: null };

export default function AutoCompleteBox() {  
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })  
  
  if (!isLoaded) {
    return <Skeleton />
  } 
  return <Map />;
}

function Map() {
  const center = { lat: 3.140853, lng: 101.693207 }; //Default Kuala Lumpur
  const [selected, setSelected] = React.useState(null);
  return (
    <>
    
    <Typography variant="h3">Location</Typography>
  <PlacesAutocomplete setSelected={setSelected} />
  <Box height={700}>
  <GoogleMap
    center={selected?selected:center}
    zoom={15}
    mapContainerStyle={{ width: '100%', height: '70%' }}
  >
    {selected && <Marker position={selected}/>}
  </GoogleMap>
  </Box>
  </>);
}

const PlacesAutocomplete = ({ setSelected }) => {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const dispatch = useDispatch();
  
  const fetch = React.useMemo(
    () =>
      throttle(
        (
          request,
          callback,
        ) => {
          (autocompleteService.current).getPlacePredictions(
            request,
            callback,
          );
        },
        200,
      ),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window).google) {
      autocompleteService.current = new (
        window
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleSelect = async (value) => {
    if(value){      
      setValue(value, false);

      
      dispatch(addItem(value))
      const results = await getGeocode({ address:value.description });
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
    }
  };

  return (    
        <Autocomplete
          sx={{ width: 500, margin: 1 }}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.description
          }
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            handleSelect(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <CssTextField {...params} label="Find a location" fullWidth/>
          )}
          renderOption={(props, option) => {

            return (
              <li {...props}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Box
                      sx={{ color: 'text.secondary', mr: 2 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Grid>
                </Grid>
                
              </li>
            );
          }}
        />
    
  );
}


