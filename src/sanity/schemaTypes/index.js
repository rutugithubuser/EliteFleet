import { carType } from "./car";
import { categoryType } from "./category";
import { testimonialType } from "./testimonial";
import { siteSettingsType } from "./siteSettings";
import { homePageType } from "./homePage";

export const schema = {
  types: [carType, categoryType, testimonialType, siteSettingsType, homePageType],
};