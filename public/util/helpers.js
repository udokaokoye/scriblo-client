import moment from "moment";
import { allTags } from "./allTags";
export function formatDate(date) {
    const currentDate = moment();
    const yourDate = moment(date);
    const dateDifference = currentDate.diff(yourDate, 'minutes');
  
    if (dateDifference < 60) {
      return `${dateDifference} mins ago`;
    } else if (dateDifference < 1440) {
      return `${Math.floor(dateDifference / 60)} hours ago`;
    } else if (dateDifference < 4320) {
      return `${Math.floor(dateDifference / 1440)} days ago`;
    } else {
      return yourDate.format('MMM D, YYYY'); // or any other format you desire
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
  