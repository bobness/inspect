import moment from "moment";

export const convertDate = (date_str: string) => {
  return moment(date_str).fromNow();
};
