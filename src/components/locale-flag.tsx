import type { Locale } from "@/lib/i18n";
const star =
  "0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309";
/** Local vector flags keep rendering consistent without emoji fonts or remote assets. */
export function LocaleFlag({ locale }: { locale: Locale }) {
  return (
    <span className="locale-flag" aria-hidden="true">
      <svg viewBox="0 0 28 20" focusable="false">
        {locale === "en" && (
          <>
            <rect width="28" height="20" fill="#fff" />
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                y={(i * 40) / 13}
                width="28"
                height={20 / 13}
                fill="#b22234"
              />
            ))}
            <rect width="12" height={140 / 13} fill="#3c3b6e" />
            {Array.from({ length: 9 }, (_, row) =>
              Array.from({ length: row % 2 ? 5 : 6 }, (_, column) => (
                <polygon
                  key={`${row}-${column}`}
                  points={star}
                  fill="#fff"
                  transform={`translate(${row % 2 ? 2 + column * 2 : 1 + column * 2} ${0.7 + row * 1.16}) scale(.46)`}
                />
              )),
            )}
          </>
        )}
        {locale === "pt" && (
          <>
            <rect width="28" height="20" fill="#168447" />
            <path d="M14 2 26 10 14 18 2 10Z" fill="#ffdf45" />
            <circle cx="14" cy="10" r="5.3" fill="#214c9d" />
            <path
              d="M9 8.8q5-1.2 10 3"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
            />
            {[
              [12, 12],
              [16, 10],
              [15, 13],
              [11, 10],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r=".3" fill="#fff" />
            ))}
          </>
        )}
        {locale === "es" && (
          <>
            <rect width="28" height="20" fill="#aa2031" />
            <rect y="5" width="28" height="10" fill="#ffce44" />
            <path d="M7 8h4v4q-2 3-4 0Z" fill="#b22c37" />
            <path d="M7 8h4M7.4 7h3.2" stroke="#bf8d32" strokeWidth="1" />
          </>
        )}
        {locale === "de" && (
          <>
            <rect width="28" height="20" fill="#ffce44" />
            <rect width="28" height={40 / 3} fill="#d12a3d" />
            <rect width="28" height={20 / 3} fill="#242833" />
          </>
        )}
        {locale === "fr" && (
          <>
            <rect width="28" height="20" fill="#fff" />
            <rect width={28 / 3} height="20" fill="#214c9d" />
            <rect x={56 / 3} width={28 / 3} height="20" fill="#df3d4b" />
          </>
        )}
        {locale === "zh" && (
          <>
            <rect width="28" height="20" fill="#df3038" />
            <polygon
              points={star}
              fill="#ffdf45"
              transform="translate(6 5.5) scale(2.9)"
            />
            {[
              [11, 2.3, 25],
              [13, 4.5, 50],
              [13, 7.3, 0],
              [10.8, 9.5, 25],
            ].map(([x, y, r]) => (
              <polygon
                key={`${x}-${y}`}
                points={star}
                fill="#ffdf45"
                transform={`translate(${x} ${y}) rotate(${r}) scale(.9)`}
              />
            ))}
          </>
        )}
      </svg>
    </span>
  );
}
