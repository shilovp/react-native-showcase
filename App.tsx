import React, {useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

async function requestLocationPermission() {
  return check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
}

function App(): JSX.Element {
  const [location, setLocation] = useState(false);
  const getLocation = () => {
    // const [location, setLocation] = useState(false);
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          const result = requestLocationPermission();
          result.then(res => {
            console.log('res is:', res);
            if (res) {
              Geolocation.getCurrentPosition(
                position => {
                  console.log(position);
                  setLocation(position);
                },
                error => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                  setLocation(false);
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
              );
            }
          });
          console.log(location);
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Check your location</Text>
      <View style={styles.locationButton}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: '40%',
  },
});

export default App;
