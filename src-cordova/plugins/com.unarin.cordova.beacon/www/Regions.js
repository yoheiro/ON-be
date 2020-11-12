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

const _ = require('com.unarin.cordova.beacon.underscorejs');
const CircularRegion = require('com.unarin.cordova.beacon.CircularRegion');
const BeaconRegion = require('com.unarin.cordova.beacon.BeaconRegion');
const Region = require('com.unarin.cordova.beacon.Region');

/**
 * Utility class for un-marshalling {Region} instances from JSON objects,
 * checking their types.
 *
 * @type {Regions}
 */
function Regions() {}

/**
 * Creates an instance of {@link Region} from the provided map of parameters.
 *
 * @param jsonMap The JSON object which is used to construct the return value.
 *
 * @returns {Region} Returns a subclass of {@link Region}.
 */
Regions.fromJson = function (jsonMap) {
  const typeName = jsonMap.typeName;
  if (!_.isString(typeName) || _.isEmpty(typeName)) {
    throw new TypeError('jsonMap need to have a key "typeName"');
  }

  const identifier = jsonMap.identifier;

  let region = null;
  if (typeName === 'CircularRegion') {
    const latitude = jsonMap.latitude;
    const longitude = jsonMap.longitude;
    const radius = jsonMap.radius;
    region = new CircularRegion(identifier, latitude, longitude, radius);
  } else if (typeName === 'BeaconRegion') {
    const uuid = jsonMap.uuid;
    const major = jsonMap.major;
    const minor = jsonMap.minor;
    region = new BeaconRegion(identifier, uuid, major, minor);
  } else {
    console.error('Unrecognized Region typeName: ' + typeName);
  }

  return region;
};

Regions.fromJsonArray = function (jsonArray) {
  if (!_.isArray(jsonArray)) {
    throw new TypeError('Expected an array.');
  }

  const result = [];
  _.each(jsonArray, function (region) {
    result.push(Regions.fromJson(region));
  });
  return result;
};

/**
 * Validates the input parameter [region] to be an instance of {Region}.
 *
 * @param {Region} region : The object that's type will be checked.
 *
 * @returns {undefined} If [region] is an instance of {Region}, throws otherwise.
 */
Regions.checkRegionType = function (region) {
  const regionHasInvalidType = !(region instanceof Region);
  if (regionHasInvalidType) {
    throw new TypeError('The region parameter has to be an instance of Region');
  }
};

Regions.isRegion = function (object) {
  return object instanceof Region;
};

Regions.isCircularRegion = function (object) {
  return object instanceof CircularRegion;
};

Regions.isBeaconRegion = function (object) {
  return object instanceof BeaconRegion;
};

module.exports = Regions;
