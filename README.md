# AniHelp

### Configuration (common.js)

This contains all configuration for Firebase and TomTom. It also includes conversion of error messages into a user-friendly error message.


### class/organization.js

Contains all organization-related classes and activities.

**getAllOrganizations**

Returns the list of organizations from the "organizations" collection in Firestore

**getOrganization(uid)**
  - This function loops through each document in the organization collection to find which organization contains the uid.
    ![image](https://github.com/zeckkimon/AniHelp/assets/26020262/74b7886c-99a5-45e1-a23e-6587e363cc33)


  - The uid is should be from Fire Auth. It is specified when the user logs in.
    ![image](https://github.com/zeckkimon/AniHelp/assets/26020262/a2bea98c-86ea-48c3-b92e-cfe179b6ab89)

  > [!IMPORTANT]
  > An account should be assigned to only one organization. If assigned to multiple, only one organizaton will be returned.


<!-- =============== Credits for the images in the reports =============== -->

Pixabay: https://www.pexels.com/photo/black-deer-lying-on-plants-near-green-trees-during-daytime-76972/
Pixabay: https://www.pexels.com/photo/brown-bear-on-a-body-of-water-158109/
Jan Kopczyński: https://www.pexels.com/photo/cute-dog-sitting-on-wood-log-in-forest-16271644/
Niklas Jeromin: https://www.pexels.com/photo/brown-deer-standing-on-brown-soil-3832008/
Yana Kangal: https://www.pexels.com/photo/cat-lying-down-on-blanket-on-beach-17459297/
Nicky Pe: https://www.pexels.com/photo/photo-of-a-cougar-near-a-log-7598287/
Skyler Ewing: https://www.pexels.com/photo/adorable-chipmunk-with-peanut-in-nature-5627781/
Andrey Yudkin: https://www.pexels.com/photo/raccoon-standing-on-fallen-leaves-9179705/
Steve: https://www.pexels.com/photo/grey-and-white-wolf-selective-focus-photography-682361/
Pranavsinh suratia: https://www.pexels.com/photo/close-up-shot-of-a-bat-12019751/
Esteban Arango: https://www.pexels.com/photo/coyote-lying-on-grass-10226903/
Jean van der Meulen: https://www.pexels.com/photo/close-up-photo-of-owl-with-one-eye-open-1564839/
Aa Dil: https://www.pexels.com/photo/close-up-photo-of-owl-2474014/
Jean van der Meulen: https://www.pexels.com/photo/portrait-photo-of-brown-and-gray-bird-1526410/
Ana  Pereira: https://www.pexels.com/photo/close-up-of-goose-17993136/
Osmany Mederos: https://www.pexels.com/photo/crow-walking-on-grass-ground-16057123/
Erik Karits: https://www.pexels.com/photo/black-bearded-dragon-on-green-grass-3820309/
Macro Photography: https://www.pexels.com/photo/frog-hiding-from-rain-under-a-leaf-12569708/
Silvana Palacios: https://www.pexels.com/photo/black-and-white-whale-jumping-on-water-3635870/
Guillaume Hankenne: https://www.pexels.com/photo/gray-dolphin-on-body-of-water-1986374/
Skitterphoto: https://www.pexels.com/photo/sea-animal-dog-zoo-23087/

<!-- =============== Credits for the images in the presentation =============== -->

p1 https://stock.adobe.com/images/the-hands-of-the-family-and-the-furry-paw-of-the-cat-as-a-team-fighting-for-animal-rights-helping-animals/250319373
P3 https://stock.adobe.com/images/brown-turtle-isolated-on-white/589205562
P5 https://stock.adobe.com/images/woman-taking-a-picture-of-her-dog-with-the-phone/224255743
p6 https://stock.adobe.com/ca/images/closeup-of-business-woman-hands-typing-on-keyboard-working-online-in-modern-office-programmer-coder-using-laptop-computer-at-workplace-remote-job-concept-technology-concept/624566492
p12 https://stock.adobe.com/images/young-handsome-adult-man-working-in-animal-shelter/462493334
p13 https://stock.adobe.com/images/volunteer-with-cute-raccoon-in-animal-shelter-closeup/447848579
























