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

describe('CircularRegion', function () {
  it('is defined', function () {
    expect(CircularRegion).toBeDefined();
  });

  it('has a constructor to create instances.', function () {
    // Coordinates for London, Charing Cross
    const latitude = 51.5072;
    const longitude = -0.1275;
    const radius = 200; // 200 meters of radius
    const identifier = 'charingCrossRegion';
    const charingCross = new CircularRegion(
      identifier,
      latitude,
      longitude,
      radius
    );

    expect(charingCross).toBeDefined();
    expect(charingCross instanceof CircularRegion).toBe(true);

    expect(charingCross.latitude).toBe(latitude);
    expect(charingCross.longitude).toBe(longitude);
    expect(charingCross.identifier).toBe(identifier);
    expect(charingCross.radius).toBe(radius);

    expect(charingCross.typeName).toBe('CircularRegion');
  });

  it('has a constructor which throws if a too small latitude is passed', function () {
    const invalidLongitude = -1000;
    const latitude = 12;
    const radius = 100;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, latitude, invalidLongitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if a too large latitude is passed', function () {
    const longitude = 10;
    const invalidLatitude = 1112;
    const radius = 100;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, invalidLatitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if a too small longitude is passed', function () {
    const longitude = 10;
    const invalidLatitude = -1112;
    const radius = 100;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, invalidLatitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if a too large longitude is passed', function () {
    const longitude = 10;
    const invalidLatitude = 1112;
    const radius = 100;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, invalidLatitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if the radius is negative', function () {
    const longitude = 10;
    const latitude = 20;
    const radius = -1;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, latitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if the radius is not a number', function () {
    const longitude = 10;
    const latitude = 20;
    const radius = NaN;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, latitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if the longitude is not a number', function () {
    const longitude = NaN;
    const latitude = 20;
    const radius = 19;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, latitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if the latitude is not a number', function () {
    const longitude = 12;
    const latitude = NaN;
    const radius = 19;
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, latitude, longitude, radius);
    }).toThrow();
  });

  it('has a constructor which throws if the radius is a string', function () {
    const longitude = 10;
    const latitude = 20;
    const radius = '';
    const identifier = 'IdentifierOfAPlace';

    expect(function () {
      new CircularRegion(identifier, latitude, longitude, radius);
    }).toThrow();
  });
});
