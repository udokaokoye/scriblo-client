import moment from "moment";
import 'moment-timezone';
import { allTags } from "./allTags";
export function formatDate(date) {
  const now = moment();
  const inputDate = moment.tz(date, getUserTimeZone());

  const diffInSeconds = now.diff(inputDate, 'seconds');
  const diffInMinutes = now.diff(inputDate, 'minutes');
  const diffInHours = now.diff(inputDate, 'hours');
  const diffInDays = now.diff(inputDate, 'days');
  const diffInMonths = now.diff(inputDate, 'months');
  const diffInYears = now.diff(inputDate, 'years');

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else {
    return `${diffInYears} years ago`;
  }
  }
  export function limitText(text, limit) {
    const words = text.split(' ');
  
    if (words.length <= limit) {
      return text;
    } else {
      const truncatedString = words.slice(0, limit).join(' ');
      return truncatedString + "...";
    }
  }
  export function getTagIDs(tagNames) {
    const tagLookup = allTags.reduce((lookup, tag) => {
      lookup[tag.name] = tag.id;
      return lookup;
    }, {});
  
    const namesArray = tagNames.split(',');
    const idsArray = namesArray.map(name => tagLookup[name]);
    const validIdsArray = idsArray.filter(id => id !== undefined);
    const idsString = validIdsArray.join(',');
  
    return idsString;
  }
  function createNameIdMap(arr) {
    const nameIdMap = new Map();
    for (const obj of arr) {
      nameIdMap.set(obj.name, obj.id);
    }
    return nameIdMap;
  }
  
  export function getTagID(name) {
    const nameIdMap = createNameIdMap(allTags);
    return nameIdMap.get(name);
  }

  export function extractIdFromSlug(slug) {
    var parts = slug.split("-");
    return parts[parts.length - 1];
  }

  export const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // Make it hidden offscreen
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  
  export function getUserTimeZone() {
    const userTimeZoneOffset = new Date().getTimezoneOffset();
    const userTimeZone = moment.tz.guess();
    const currentTimeZoneOffset = moment.tz(userTimeZone).utcOffset();
  
    if (userTimeZoneOffset === currentTimeZoneOffset) {
      return userTimeZone;
    } else {
      // If the offset doesn't match, we'll try to find a matching timezone using the offset
      const timeZones = moment.tz.names();
      for (let i = 0; i < timeZones.length; i++) {
        if (moment.tz(timeZones[i]).utcOffset() === userTimeZoneOffset) {
          return timeZones[i];
        }
      }
      // If no match is found, return the default timezone
      return userTimeZone;
    }
  }