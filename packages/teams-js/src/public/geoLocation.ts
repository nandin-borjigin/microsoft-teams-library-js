import { sendAndHandleSdkError as sendAndHandleError } from '../internal/communication';
import { ensureInitialized } from '../internal/internalAPIs';
import { errorNotSupportedOnPlatform, FrameContexts } from './constants';
import { DevicePermission, ErrorCode, Location } from './interfaces';
import { runtime } from './runtime';

/**
 * Namespace to interact with the geoLocation module-specific part of the SDK. This is the newwer version of location module.
 */
export namespace geoLocation {
  /**
   * Fetches current user coordinates
   * @returns User's current location
   */
  export function getCurrentLocation(): Promise<Location> {
    ensureInitialized(FrameContexts.content, FrameContexts.task);
    if (!isSupported()) {
      throw errorNotSupportedOnPlatform;
    }
    return sendAndHandleError('location.getLocation', { allowChooseLocation: false, showMap: false });
  }

  /**
   * Checks whether or not location has user permission
   *
   * @returns if the location has user permission
   */
  export function hasPermission(): Promise<boolean> {
    ensureInitialized(FrameContexts.content, FrameContexts.task);
    if (!isSupported()) {
      throw errorNotSupportedOnPlatform;
    }
    const permissions: DevicePermission = DevicePermission.GeoLocation;

    return new Promise<boolean>(resolve => {
      resolve(sendAndHandleError('permissions.has', permissions));
    });
  }

  /**
   * Request user permission for location
   *
   * @returns if the user conseted permission for location
   */
  export function requestPermission(): Promise<boolean> {
    ensureInitialized(FrameContexts.content, FrameContexts.task);
    if (!isSupported()) {
      throw errorNotSupportedOnPlatform;
    }
    const permissions: DevicePermission = DevicePermission.GeoLocation;

    return new Promise<boolean>(resolve => {
      resolve(sendAndHandleError('permissions.request', permissions));
    });
  }

  export function isSupported(): boolean {
    return runtime.supports.geoLocation ? true : false;
  }

  /**
   * Namespace to interact with the location on map module-specific part of the SDK.
   */
  export namespace map {
    /**
     * Allows user to choose location on map
     *
     * @returns The location chosen by the user after closing the map
     */
    export function chooseLocation(): Promise<Location> {
      ensureInitialized(FrameContexts.content, FrameContexts.task);
      if (!isSupported()) {
        throw errorNotSupportedOnPlatform;
      }
      return sendAndHandleError('location.getLocation', { allowChooseLocation: true, showMap: true });
    }

    /**
     * Shows the location on map corresponding to the given coordinates
     *
     * @param location {@link Location} - which needs to be shown on map
     * @returns Promise that resolves when the location dialog has been closed
     */
    export function showLocation(location: Location): Promise<void> {
      ensureInitialized(FrameContexts.content, FrameContexts.task);
      if (!isSupported()) {
        throw errorNotSupportedOnPlatform;
      }
      if (!location) {
        throw { errorCode: ErrorCode.INVALID_ARGUMENTS };
      }
      return sendAndHandleError('location.showLocation', location);
    }

    export function isSupported(): boolean {
      return runtime.supports.geoLocation ? (runtime.supports.geoLocation.map ? true : false) : false;
    }
  }
}
