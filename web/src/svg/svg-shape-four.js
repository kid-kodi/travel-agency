export const SVGShapeFour = ({ color_one, color_two }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.66 58.68">
    <polygon
      class={color_one ? color_one : "text-body"}
      points="20.69 33.95 38.85 23.45 20.68 12.98 2.5 2.5 2.52 23.47 2.53 44.45 20.69 33.95"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="5"
    />
    <polygon
      class={color_two ? color_two : "text-secondary"}
      points="43.5 47.31 61.66 36.81 43.49 26.34 25.32 15.86 25.33 36.83 25.34 57.81 43.5 47.31"
      fill="none"
      stroke="currentColor"
      stroke-miterlimit="10"
    />
  </svg>
);
