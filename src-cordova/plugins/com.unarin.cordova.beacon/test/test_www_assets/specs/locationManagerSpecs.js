/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

describe('LocationManager', function () {
  it('is defined', function () {
    expect(locationManager).toBeDefined();
  });

  it('is an instance of LocationManager', function () {
    expect(locationManager instanceof LocationManager).toBe(true);
  });

  it('stops the monitoring of circular regions', function (done) {
    // Coordinates for London, Charing Cross
    const latitude = 51.5072;
    const longitude = -0.1275;
    const radius = 200; // 200 meters of radius
    const id = 'charingCrossRegion';
    const charingCross = new CircularRegion(id, latitude, longitude, radius);

    locationManager
      .stopMonitoringForRegion(charingCross)
      .then(done)
      .fail(window.failJasmineTest)
      .done();
  });

  it('starts the ranging of beacon regions', function (done) {
    const delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didRangeBeaconsInRegion = function (pluginResult) {
      console.debug(
        '[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult.region)
      );
    };

    const uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9';
    const identifier = 'beaconOnTheMacBooksShelf';
    const minor = 1000;
    const major = 5;
    const beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
      identifier,
      uuid,
      major,
      minor
    );

    cordova.plugins.locationManager.setDelegate(delegate);
    cordova.plugins.locationManager
      .startRangingBeaconsInRegion(beaconRegion)
      .then(done)
      .fail(console.error)
      .done();
  });

  it('starts the monitoring of circular regions', function (done) {
    // Coordinates for London, Charing Cross
    const latitude = 51.5072;
    const longitude = -0.1275;
    const radius = 200; // 200 meters of radius
    const id = 'charingCrossRegion';
    const charingCross = new CircularRegion(id, latitude, longitude, radius);

    expect(charingCross).toBeDefined();
    expect(charingCross instanceof CircularRegion).toBe(true);

    const delegate = new Delegate();
    delegate.didDetermineStateForRegion = function (pluginResult) {
      expect(Delegate.didDetermineStateForRegion).toHaveBeenCalled();
      expect(pluginResult).toBeDefined();
      expect(pluginResult.region).toBeDefined();
      locationManager.appendToDeviceLog(
        '[DOM] didDetermineStateForRegion: ' +
          JSON.stringify(pluginResult.region)
      );
    };
    delegate.didStartMonitoringForRegion = function (pluginResult) {
      console.log('didStartMonitoringForRegion:', pluginResult);

      const region = pluginResult.region;
      expect(region).toBeDefined();
      expect(region instanceof Region).toBe(true);
      done();
    };

    locationManager.setDelegate(delegate);
    locationManager
      .startMonitoringForRegion(charingCross)
      .fail(window.failJasmineTest)
      .done();
  });

  it('starts the monitoring of circular regions #2', function (done) {
    // Coordinates for Apple HQ, so it is easy to debug from the simulator
    // Actual address: 1 Infinite Loop, Cupertino, CA 95014-2083
    const latitude = 37.330561;
    const longitude = -122.029832;
    const radius = 200; // 200 meters of radius
    const id = 'charingCrossRegion';
    const appleHq = new CircularRegion(id, latitude, longitude, radius);

    expect(appleHq).toBeDefined();
    expect(appleHq instanceof CircularRegion).toBe(true);

    const delegate = new Delegate();
    delegate.didDetermineStateForRegion = function (pluginResult) {
      expect(Delegate.didDetermineStateForRegion).toHaveBeenCalled();
      expect(pluginResult).toBeDefined();
      expect(pluginResult.region).toBeDefined();
      locationManager.appendToDeviceLog(
        '[DOM] didDetermineStateForRegion: ' +
          JSON.stringify(pluginResult.region)
      );
    };
    delegate.didStartMonitoringForRegion = function (pluginResult) {
      console.log('didStartMonitoringForRegion:', pluginResult);

      const region = pluginResult.region;
      expect(region).toBeDefined();
      expect(region instanceof Region).toBe(true);
      done();
    };

    locationManager.setDelegate(delegate);
    locationManager
      .startMonitoringForRegion(appleHq)
      .fail(window.failJasmineTest)
      .done();
  });

  it('starts monitoring of beacon regions.', function () {
    // You can't test the iBeacon monitoring properly in the emulator, thus the crippled test.
    const uuid = '328B8BF6-B6ED-4DBF-88F3-287E3B3F16B6';
    const identifier = 'asdf';
    const minor = 12345;
    const major = 23455;
    const beaconRegion = new BeaconRegion(identifier, uuid, major, minor);

    locationManager
      .startMonitoringForRegion(beaconRegion)
      .fail(window.failJasmineTest)
      .done();
  });

  it('turns debug logging on and off', function (done) {
    locationManager
      .enableDebugLogs()
      .then(locationManager.disableDebugLogs)
      .then(function () {
        done();
        // make sure logs are enabled while the tests are running
        locationManager.enableDebugLogs();
      })
      .done();
  });

  it('turns debug logging off and on', function (done) {
    locationManager
      .disableDebugLogs()
      .then(locationManager.enableDebugLogs)
      .then(done)
      .done();
  });

  it('queries the native layer for authorizationStatus', function (done) {
    const validStatuses = [
      'AuthorizationStatusNotDetermined',
      'AuthorizationStatusRestricted',
      'AuthorizationStatusDenied',
      'AuthorizationStatusAuthorized',
      'AuthorizationStatusAuthorizedWhenInUse',
      'AuthorizationStatusAuthorizedAlways',
    ];

    locationManager
      .getAuthorizationStatus()
      .then(function (pluginResult) {
        expect(pluginResult).toBeDefined();

        const status = pluginResult.authorizationStatus;
        expect(status).toBeDefined();

        expect(validStatuses.indexOf(status)).toBeGreaterThan(-1);
        done();
      })
      .done();
  });

  it('determines if ranging is available or not', function (done) {
    locationManager
      .isRangingAvailable()
      .then(function (isRangingAvailable) {
        expect(typeof isRangingAvailable).toBe('boolean');
        done();
      })
      .done();
  });

  it('gets an array of monitored regions', function (done) {
    locationManager
      .getMonitoredRegions()
      .then(function (regions) {
        expect(_.isArray(regions)).toBe(true);
        expect(_.every(regions, Regions.isRegion)).toBe(true);
        done();
      })
      .done();
  });

  it('gets an array of ranged regions', function (done) {
    locationManager
      .getRangedRegions()
      .then(function (regions) {
        expect(_.isArray(regions)).toBe(true);
        expect(_.every(regions, Regions.isRegion)).toBe(true);
        done();
      })
      .done();
  });

  it('sends debug log messages to the native layer', function (done) {
    const testMessage = 'Test log messeage from the specs.';
    locationManager
      .appendToDeviceLog(testMessage)
      .then(function (pluginResult) {
        expect(pluginResult).toBe(testMessage);
        done();
      })
      .done();
  });

  it('determines if advertising is supported', function (done) {
    locationManager
      .isAdvertisingAvailable()
      .then(function (isSupported) {
        expect(isSupported).toBe(true);
        done();
      })
      .done();
  });

  it('starts advertising as a beacon', function () {
    const delegate = new cordova.plugins.locationManager.Delegate();

    // Event when advertising starts (there may be a short delay after the request)
    // The property 'region' provides details of the broadcasting Beacon
    delegate.peripheralManagerDidStartAdvertising = function (pluginResult) {
      console.log(
        'peripheralManagerDidStartAdvertising: ' +
          JSON.stringify(pluginResult.region)
      );
    };
    // Event when bluetooth transmission state changes
    // If 'state' is not set to BluetoothManagerStatePoweredOn when advertising cannot start
    delegate.peripheralManagerDidUpdateState = function (pluginResult) {
      console.log('peripheralManagerDidUpdateState: ' + pluginResult.state);
    };

    cordova.plugins.locationManager.setDelegate(delegate);

    // You can't test the iBeacon monitoring properly in the emulator, thus the crippled test.
    const uuid = '328B8BF6-B6ED-4DBF-88F3-287E3B3F16B6';
    const identifier = 'advertisedBeacon';
    const minor = 2;
    const major = 1;
    const beaconRegion = new BeaconRegion(identifier, uuid, major, minor);

    locationManager
      .startAdvertising(beaconRegion)
      .fail(window.failJasmineTest)
      .done();
  });

  it('stops advertising as a beacon.', function () {
    locationManager.stopAdvertising().fail(window.failJasmineTest).done();
  });

  it('requests permission "when in use"', function (done) {
    locationManager
      .requestWhenInUseAuthorization()
      .then(function (pluginResult) {
        expect(pluginResult).toBe('OK');
        done();
      })
      .done();
  });

  it('requests permission "always"', function (done) {
    locationManager
      .requestAlwaysAuthorization()
      .then(function (pluginResult) {
        expect(pluginResult).toBe('OK');
        done();
      })
      .done();
  });
});
