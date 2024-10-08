export const tokens = {
  borderRadius: {
    '1xl': '12px',
    '2xl': '14px',
    '3xl': '16px',
    '4xl': '18px',
    '5xl': '20px',
    full: '9999px',
    lg: '8px',
    md: '6px',
    none: '0px',
    sm: '4px',
    xl: '10px',
  },
  boxShadow: {
    l2: '0px 1px 2px 0px rgba(12, 26, 37, 0.18)',
    l3: '0px 4px 8px 0px rgba(12, 26, 37, 0.04)',
    l4: '0px 4px 8px 0px rgba(12, 26, 37, 0.08)',
    l5: '0px 8px 20px 0px rgba(12, 26, 37, 0.12)',
  },
  breakpoints: {
    '2xl': '1536px',
    lg: '1024px',
    md: '768px',
    sm: '640px',
    xl: '1280px',
    xs: '450px',
  },
  colors: {
    blueberry: {
      '10': '#E8EBF6',
      '20': '#C4CCE9',
      '30': '#9DABD9',
      '40': '#768ACA',
      '50': '#3557B4',
      '60': '#25459E',
      '70': '#0B297D',
    },
    danger: {
      '10': '#ffe6e9',
      '20': '#ffb8c4',
      '30': '#ff668a',
      '40': '#ed1252',
      '50': '#cc254b',
      '60': '#a1003b',
      '70': '#7a0031',
    },
    mint: {
      '10': '#F0FFFA',
      '20': '#D1FFF4',
      '30': '#A8FFEE',
      '40': '#55F9E2',
      '50': '#3DD4C5',
      '60': '#2AADA5',
      '70': '#116161',
    },
    neutral: {
      '10': '#FFFFFF',
      '20': '#F5F7FA',
      '30': '#EEF1F6',
      '40': '#E6E9EE',
      '50': '#C4C8CD',
      '60': '#B2B7BD',
      '70': '#717780',
      '80': '#535B66',
      '90': '#151E29',
    },
    primary: {
      '10': '#e6f8ff',
      '20': '#a3e2ff',
      '30': '#7ad1ff',
      '40': '#018bff',
      '50': '#006FD6',
      '60': '#0056b3',
      '70': '#004092',
    },
    success: {
      '10': '#E1FAEF',
      '20': '#98EDCB',
      '30': '#44D4A4',
      '40': '#00BA88',
      '50': '#327D60',
      '60': '#006E58',
      '70': '#00473B',
    },
    warning: {
      '10': '#FFFBDE',
      '20': '#FFF4B5',
      '30': '#FFEA8C',
      '40': '#FFDE63',
      '50': '#D9B54A',
      '60': '#966c2e',
      '70': '#664817',
    },
  },
  font: {
    size: {
      'body-large': '1rem',
      'body-medium': '0.875rem',
      'body-small': '0.75rem',
      code: '0.875rem',
      h1: '3rem',
      h2: '2.5rem',
      h3: '1.875rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
      label: '0.875rem',
      'subheading-large': '1.25rem',
      'subheading-medium': '1rem',
      'subheading-small': '0.875rem',
    },
    weight: {
      bold: '700',
      light: '300',
      medium: '500',
      normal: '400',
      semibold: '600',
    },
  },
  palette: {
    categorical: {
      '1': '#55BDC5',
      '10': '#BF732D',
      '11': '#478A6E',
      '12': '#ADE86B',
      '2': '#4D49CB',
      '3': '#DC8B39',
      '4': '#C9458D',
      '5': '#8E8CF3',
      '6': '#78DE7C',
      '7': '#3F80E3',
      '8': '#673FAB',
      '9': '#DBBF40',
    },
    dark: {
      danger: {
        bg: {
          strong: '#ffb8c4',
          weak: '68, 61, 72',
        },
        border: {
          strong: '#ffb8c4',
          weak: '114, 91, 103',
        },
        hover: {
          strong: '#ff668a',
          weak: 'rgba(255, 102, 138,0.08)',
        },
        icon: '#ffb8c4',
        pressed: {
          strong: '#ff668a',
          weak: 'rgba(255, 102, 138,0.12)',
        },
        text: '#ffb8c4',
      },
      neutral: {
        bg: {
          default: '#151E29',
          strong: '45, 53, 63',
          strongest: '#FFFFFF',
          weak: '29, 38, 49',
        },
        border: {
          strong: '#717780',
          weak: '37, 47, 59',
        },
        hover: 'rgba(196, 200, 205,0.1)',
        icon: '#C4C8CD',
        pressed: 'rgba(196, 200, 205,0.2)',
        text: {
          default: '#F5F7FA',
          inverse: '#151E29',
          weak: '#C4C8CD',
          weaker: '#B2B7BD',
          weakest: '#717780',
        },
      },
      primary: {
        bg: {
          strong: '#a3e2ff',
          weak: '49, 69, 84',
        },
        border: {
          strong: '#a3e2ff',
          weak: '78, 108, 126',
        },
        focus: '#7ad1ff',
        hover: {
          strong: '#7ad1ff',
          weak: 'rgba(122, 209, 255,0.08)',
        },
        icon: '#a3e2ff',
        pressed: {
          strong: '#7ad1ff',
          weak: 'rgba(122, 209, 255,0.12)',
        },
        text: '#a3e2ff',
      },
      success: {
        bg: {
          strong: '#98EDCB',
          weak: '47, 71, 73',
        },
        border: {
          strong: '#98EDCB',
          weak: '73, 113, 106',
        },
        icon: '#98EDCB',
        text: '#98EDCB',
      },
      warning: {
        bg: {
          strong: '#FFEA8C',
          weak: '68, 71, 60',
        },
        border: {
          strong: '#FFEA8C',
          weak: '114, 111, 80',
        },
        icon: '#FFEA8C',
        text: '#FFEA8C',
      },
    },
    graph: {
      '1': '#FFDF81',
      '10': '#FFC354',
      '11': '#DA7294',
      '12': '#579380',
      '2': '#C990C0',
      '3': '#F79767',
      '4': '#56C7E4',
      '5': '#F16767',
      '6': '#D8C7AE',
      '7': '#8DCC93',
      '8': '#ECB4C9',
      '9': '#4D8DDA',
    },
    light: {
      danger: {
        bg: {
          strong: '#cc254b',
          weak: '#ffe6e9',
        },
        border: {
          strong: '#cc254b',
          weak: '#ffb8c4',
        },
        hover: {
          strong: '#a1003b',
          weak: 'rgba(237,18,82,0.08)',
        },
        icon: '#cc254b',
        pressed: {
          strong: '#7a0031',
          weak: 'rgba(237,18,82,0.12)',
        },
        text: '#cc254b',
      },
      neutral: {
        bg: {
          default: '#F5F7FA',
          strong: '#E6E9EE',
          strongest: '#535B66',
          weak: '#FFFFFF',
        },
        border: {
          strong: '#C4C8CD',
          weak: '#EEF1F6',
        },
        hover: 'rgba(113,119,128,0.1)',
        icon: '#535B66',
        pressed: 'rgba(113,119,128,0.2)',
        text: {
          default: '#151E29',
          inverse: '#FFFFFF',
          weak: '#535B66',
          weaker: '#717780',
          weakest: '#B2B7BD',
        },
      },
      primary: {
        bg: {
          strong: '#006FD6',
          weak: '#e6f8ff',
        },
        border: {
          strong: '#006FD6',
          weak: '#7ad1ff',
        },
        focus: '#018bff',
        hover: {
          strong: '#0056b3',
          weak: 'rgba(1,139,255,0.08)',
        },
        icon: '#006FD6',
        pressed: {
          strong: '#004092',
          weak: 'rgba(1,139,255,0.12)',
        },
        text: '#006FD6',
      },
      success: {
        bg: {
          strong: '#327D60',
          weak: '#E1FAEF',
        },
        border: {
          strong: '#327D60',
          weak: '#98EDCB',
        },
        icon: '#327D60',
        text: '#327D60',
      },
      warning: {
        bg: {
          strong: '#966c2e',
          weak: '#FFFBDE',
        },
        border: {
          strong: '#966c2e',
          weak: '#FFEA8C',
        },
        icon: '#966c2e',
        text: '#966c2e',
      },
    },
  },
  space: {
    '0': '0px',
    '1': '1px',
    '10': '64px',
    '11': '96px',
    '12': '128px',
    '13': '320px',
    '2': '2px',
    '3': '4px',
    '4': '8px',
    '5': '12px',
    '6': '16px',
    '7': '24px',
    '8': '32px',
    '9': '48px',
  },
  transitions: {
    default: 'all 100ms cubic-bezier(0.420, 0.000, 0.580, 1.000)',
    stripped: '100ms cubic-bezier(0.420, 0.000, 0.580, 1.000)',
    values: {
      duration: {
        default: '100ms',
      },
      properties: {
        default: 'all',
      },
      'timing-function': {
        default: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
      },
    },
  },
  zIndex: {
    '0': 0,
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
    '60': 60,
    alias: {
      banner: 20,
      blanket: 30,
      modal: 60,
      overlay: 10,
      popover: 40,
      tooltip: 50,
    },
    auto: 'auto',
    deep: -999999,
  },
};
