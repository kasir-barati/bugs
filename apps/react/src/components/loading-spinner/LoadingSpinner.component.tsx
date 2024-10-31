import classNames from 'classnames';
import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';
import styles from './LoadingSpinner.module.css';

const accessibilityAttributes: DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> = {
  'role': 'presentation',
  'title': 'Loading...',
  'aria-label': 'Loading...',
};

export function LoadingSpinnerEclipsingMoon() {
  return (
    <span
      {...accessibilityAttributes}
      className={styles['loader-eclipsing-moon']}
    >
      L &nbsp; ading
    </span>
  );
}

interface LoadingSpinnerFullMoonProps {
  style?: CSSProperties;
}

export function LoadingSpinnerFullMoon({
  style,
}: Readonly<LoadingSpinnerFullMoonProps>) {
  return (
    <span
      style={style}
      {...accessibilityAttributes}
      className={styles['loader-full-moon']}
    ></span>
  );
}

export function LoadingSpinnerMoonToSun() {
  return (
    <span
      {...accessibilityAttributes}
      className={styles['loader-moon-to-sun']}
    ></span>
  );
}

export function LoadingSpinnerSun() {
  return (
    <span
      {...accessibilityAttributes}
      className={styles['loader-sun']}
    ></span>
  );
}

interface LoadingSpinnerBluePlanetProps {
  style?: CSSProperties;
}

export function LoadingSpinnerBluePlanet({
  style,
}: Readonly<LoadingSpinnerBluePlanetProps>) {
  return (
    <span
      style={style}
      {...accessibilityAttributes}
      className={styles['loader-blue-planet']}
    ></span>
  );
}

interface LoadingSpinnerMoonCratersProps {
  className?: string;
}

export function LoadingSpinnerMoonCraters({
  className,
}: Readonly<LoadingSpinnerMoonCratersProps>) {
  return (
    <div
      role="img"
      aria-label="Loading spinner moon."
      aria-description="A spinning moon with 3 craters on it."
      className={classNames(styles['loader-moon-craters'], className)}
    >
      <div className={styles.moon}>
        <div className={styles.moon__hemisphere}>
          <div
            className={classNames(
              styles.crater,
              styles['tycho-crater'],
            )}
          />
          <div
            className={classNames(
              styles.crater,
              styles['copernicus-crater'],
            )}
          />
        </div>
        <div className={styles.moon__hemisphere}>
          <div
            className={classNames(
              styles.crater,
              styles['mare-imbrium-crater'],
            )}
          />
        </div>
      </div>
    </div>
  );
}
