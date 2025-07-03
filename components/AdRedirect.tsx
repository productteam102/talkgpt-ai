// components/AdRedirect.tsx
'use client';

import { useEffect } from 'react';

export default function AdRedirect() {
  useEffect(() => {
    const shown = document.cookie.includes('adShown=true');
    const isFromGoogle = document.referrer.includes('google');

    if (!shown && !isFromGoogle) {
      const timer = setTimeout(() => {
        window.open(
          'https://webbed-leadership.com/bp3.Vs0wPt3/pSvgbMmbVoJyZPDp0k2/NCDaci0/OYDSkRxrLtTiY_0XNAzdQG4/OsTZIM',
          '_blank'
        );
        document.cookie = 'adShown=true; max-age=86400'; // 1 ngày
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
