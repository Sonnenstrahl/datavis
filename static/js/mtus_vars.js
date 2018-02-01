/**
 * @Author: David Haas
 * @Date: 22.01.2018
 */

/**
 * This Section holds all the MTUS variables as keys, this is used to convert the specific key into something readable
 *
 * Some countries here have a slightly different Name than in the MTUS Guide,
 * they have been renamed to correspond to the according geojson country, have a look at custom.geo.json
 */
var countrya = {
    1: 'Armenia',
    2: 'Australia',
    3: 'Austria',
    4: 'Belgium',
    5: 'Brazil',
    6: 'Bulgaria',
    7: 'Canada',
    8: 'China',
    9: 'Denmark',
    10: 'Estonia',
    11: 'Finland',
    12: 'France',
    13: 'Germany',
    14: 'Hungary',
    15: 'India',
    16: 'Ireland',
    17: 'Isreal',
    18: 'Italy',
    19: 'Japan',
    20: 'Latvia',
    21: 'Lithuania',
    22: 'Netherlands',
    23: 'New Zealand',
    24: 'Norway',
    25: 'Pakistan',
    26: 'Poland',
    27: 'Portugal',
    28: 'Republic of Korea',
    29: 'Romania',
    30: 'Serbia',
    31: 'Slovakia',
    32: 'Slovenia',
    33: 'South Africa',
    34: 'Spain',
    35: 'Sweden',
    36: 'Turkey',
    37: 'United Kingdom',
    38: 'United States'
};
var day = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
    8: 'Averaged time across Week',
    9: 'Unspecified weekday',
    10: 'Unspecified weekend day',
    11: 'undefined'
};
var occup = {
    1: 'Management',
    2: 'Finance and legal',
    3: 'Science and engineering',
    4: 'Civil and social service',
    5: 'Education and social science',
    6: 'Medical',
    7: 'Other professionals',
    8: 'Health, education, and social care support',
    9: 'Clerical and office support',
    10: 'Security and armed forces',
    11: 'Sales, services, creative support, cleaning',
    12: 'Farming, forestry, fishing',
    13: 'Construction, assembly & repair, moving goods, transport, extraction',
    14: 'Self employed non-professionals',
    15: 'Others/undefined'
};
var badcase = {
    0: 'Good case',
    1: 'missing age or sex only',
    2: 'missing day of the week only',
    3: 'missing 91+ minutes in diary only',
    4: '(1 to 6) <7 episodes only',
    5: 'missing 2+ basic activities only',
    6: 'missing age or sex & the day of week ',
    7: 'missing age or sex & 91+ diary minutes',
    8: 'missing age or sex & <7 episodes',
    9: 'missing age or sex & 2+ basic activites',
    10: 'missing the day of the week & 91+ diary minutes',
    11: 'missing the day of the week & <7 episodes',
    12: 'missing the day of the week & 2+ basic activites',
    13: 'missing 91+ diary minutes & <7 episodes',
    14: 'missing 91+ diary minutes & 2+ basic activites',
    15: '<7 episodes & 2+ basic activites',
    16: 'missing age or sex, the day of the week, & 91+ diary minutes',
    17: 'missing age or sex, the day of the week, & <7 episodes',
    18: 'missing age or sex, the day of the week, & 2+ basic activites',
    19: 'missing age or sex, 91+ diary minutes, & <7 episodes',
    20: 'missing age or sex, 91+ diary minutes, & 2+ basic activites',
    21: 'missing age or sex, 2+ basic activites, & <7 episodes',
    22: 'missing the day of the week, 91+ diary minutes, & <7 episodes',
    23: 'missing the day of the week, 91+ diary minutes, & 2+ basic activites',
    24: 'missing the day of the week, 2+ basic activites, & <7 episodes',
    25: 'missing 91+ diary minutes, 2+ basic activites, & <7 episodes',
    26: 'missing age or sex, the day of the week, 91+ diary minutes, & <7 episodes',
    27: 'missing age or sex, the day of the week, 91+ diary minutes, & 2+ basic acts',
    28: 'missing age or sex, the day of the week, <7 episodes, & 2+ basic activities',
    29: 'missing age or sex, 91+ diary minutes, <7 episodes, & 2+ basic activities',
    30: 'missing day of the week, 91+ diary minutes, <7 episodes, & 2+ basic acts',
    31: 'bad case on all points '
};
var computer = {
    0: 'No',
    1: 'Yes'
};
var sex = {
    1: 'Male',
    2: 'Female'
};
var student = {
    0: 'Not a student',
    1: 'Student'
};
var retired = {
    0: 'Not retired',
    1: 'Retired'
};
var vehicle = {
    0: 'No',
    1: 'Animal only',
    2: 'Non-motorised vehicle',
    3: '1 car or motorcycle',
    4: '2+ cars or motorcycles'
};
var sector = {
    1: 'Public Sector',
    2: 'Private Sector'
};
var famstat = {
    0: 'Adult (18–39y) w/o child (<18y)',
    1: 'Adult (18y+) w. 1+ child (<5y)',
    2: 'Adult (18y+) w. 1+ child (5-17y)',
    3: 'Adult (40y+) w/o child (<18y)',
    4: 'Resp. (<18y) living w. parent(s)',
    5: 'Resp. (<18y) arrangement other',
    '-7': 'undefined'
};
var activitiesCombined = {
    0: 'Undefined',
    1: 'Work travel & commute',
    2: 'Private travel',
    3: 'Food & Drink',
    4: 'Paid & voluntary work',
    5: 'Leisure & recreation',
    6: 'Personal, household, family care',
    7: 'Sleep & rest'
};
var singpar = {
    0: 'No',
    1: 'Yes'
};
var ownhome = {
    1: 'Own',
    2: 'Rent',
    3: 'Other Arrangement',
    '-9': 'not recorded'
};
var urban = {
    1: 'Urban/Suburban',
    2: 'Rural/Semi-rural'
};
var empstat = {
    1: 'Employed Full Time',
    2: 'Employed Part Time',
    3: 'Employed, unknown status',
    4: 'Not in paid work'
};
var edcat = {
    1: 'uncompleted secondary or less',
    2: 'completed secondary',
    3: 'above secondary education'
};
var citizen = {
    0: 'No',
    1: 'Yes'
};
var civstat = {
    1: 'Diarist in a couple',
    2: 'No, diarist not in a couple'
};
var hhtype = {
    1: 'One person household',
    2: 'Couple alone',
    3: 'Couple + others',
    4: 'Other household types'
};
var cohab = {
    '-7': 'Not in a couple',
    0: 'Married/civil partners',
    1: 'Cohabiting'
};
var actToolTip = {
    1: 'imputed personal or household care',
    2: 'sleep and naps',
    3: 'imputed sleep',
    4: 'wash, dress, care for self',
    5: 'meals at work or school',
    6: 'meals or snacks in other places',
    7: 'paid work- job (not at home)',
    8: 'paid work at home',
    9: 'second or other job not at home',
    10: 'unpaid work to generate household income',
    11: 'travel as a part of work',
    12: 'work breaks',
    13: 'other time at workplace',
    14: 'look for work',
    15: 'regular schooling, education',
    16: 'homework',
    17: 'leisure & other education or training',
    18: 'food preparation, cooking',
    19: 'set table, wash/put away dishes',
    20: 'cleaning',
    21: 'laundry, ironing, clothing repair',
    22: 'maintain home/vehicle, including collect fuel',
    23: 'other domestic work',
    24: 'purchase goods',
    25: 'consume personal care services',
    26: 'consume other services',
    27: 'pet care (not walk dog)',
    28: 'physical, medical child care',
    29: 'teach, help with homework',
    30: 'read to, talk or play with child',
    31: 'supervise, accompany, other child care',
    32: 'adult care',
    33: 'voluntary, civic, organisational act',
    34: 'worship and religion',
    35: 'general out-of-home leisure',
    36: 'attend sporting event',
    37: 'cinema, theatre, opera, concert',
    38: 'other public event, venue',
    39: 'restaurant, café, bar, pub',
    40: 'party, social event, gambling',
    41: 'imputed time away from home',
    42: 'general sport or exercise',
    43: 'walking',
    44: 'cycling',
    45: 'other outside recreation',
    46: 'gardening/pick mushrooms',
    47: 'walk dogs',
    48: 'receive or visit friends',
    49: 'conversation (in person, phone)',
    50: 'games (social & solitary)/other in-home social',
    51: 'general indoor leisure',
    52: 'art or music',
    53: 'correspondence (not e-mail)',
    54: 'knit, crafts or hobbies',
    55: 'relax, think, do nothing',
    56: 'read',
    57: 'listen to music or other audio content',
    58: 'listen to radio',
    59: 'watch TV, video, DVD',
    60: 'computer games',
    61: 'e-mail, surf internet, computing',
    62: 'no activity, imputed or recorded transport',
    63: 'travel to/from work',
    64: 'education travel',
    65: 'voluntary/civic/religious travel',
    66: 'child/adult care travel',
    67: 'shop, person/hhld care travel',
    68: 'other travel',
    69: 'no recorded activity'
};
var emp = {
    0: 'Not in paid work',
    1: 'In paid work'
};
var unemp = {
    0: 'Not-unemployed',
    1: 'Unemployed'
};
var empsp = {
    1: 'Employed full-time',
    2: 'Employed part-time',
    3: 'Employed, unknown hours',
    4: 'Not in paid work',
    '-7': 'Not in a couple'
};
var rushed = {
    0: 'Almost never',
    1: 'Sometimes',
    2: 'Often'
};
var health = {
    0: 'Poor',
    1: 'Fair',
    2: 'Good',
    3: 'Very good'
};
var carer = {
    0: 'No',
    1: 'Yes'
};
var disab = {
    0: 'No',
    1: 'Yes'
};