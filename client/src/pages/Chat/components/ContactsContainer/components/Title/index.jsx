// Title component that accepts a 'text' prop and displays it as a styled heading

const Title = ({ text }) => {
  return (
    // Using the <h6> tag to render the text in a smaller heading style
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {/* The 'text' prop is rendered as the content of the <h6> tag */}
      {text}
    </h6>
  );
};

// Exporting the Title component so it can be used in other parts of the application
export default Title;
