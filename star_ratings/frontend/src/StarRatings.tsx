import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
  ComponentProps, Theme
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface State {
  rating: number;
  hoverRating: number | null;
  isFocused: boolean;
}

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class StarRatings extends StreamlitComponentBase<State> {
  public state: State = { rating: 0, hoverRating: 0, isFocused: false };

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    const { rating, hoverRating, isFocused } = this.state;
    const { args, disabled, theme }: ComponentProps & { theme?: Theme } = this.props;

    const numStars: number = args["numStars"] || 5;

    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    // const { theme } = this.props
    const primaryColor = theme?.primaryColor || "gray";
    const style: React.CSSProperties = {
      border: `1px solid ${isFocused ? primaryColor : "gray"}`,
      outline: `1px solid ${isFocused ? primaryColor : "gray"}`,
    };

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.
      const borderStyling = `1px solid ${
        this.state.isFocused ? theme.primaryColor : "gray"
      }`
      style.border = borderStyling
      style.outline = borderStyling
    }

    // Show a button and some text.
    // When the button is clicked, we'll increment our "numClicks" state
    // variable, and send its new value back to Streamlit, where it'll
    // be available to the Python program.
    return (
      <div>
        <div>
          {[...Array(numStars)].map((_, index) => (
            <span
              key={index}
              onMouseEnter={() => this.handleMouseEnter(index +1)}
              onMouseLeave={this.handleMouseLeave}
              onClick={() => this.handleRatingChange(index + 1)}
              style={{
                cursor: "pointer",
                color: index < (hoverRating || rating) ? "gold" : "grey"
              }}
            >
              {this.renderStar(index +1)}
            </span>
          ))}
          
        </div>
      </div>
      
    );
  };
  /** Click handler for our "Click Me!" button. */
  private renderStar = (index: number): ReactNode => {
    const { hoverRating, rating } = this.state;
    const roundedRating = hoverRating !== null ? hoverRating : rating;
    
    // Check if the current index is less than the rounded rating
    // If yes, render a full star
    if (index <= roundedRating) {
      return "★";
    } else {
      // Check if the rounded rating is a whole number
      // If not, check if the current index is equal to the rounded rating plus 0.5
      // If yes, render a half star

      if (this.state.rating - index === 0.5) {
        return "☆"; // Half-star symbol
      } else if (index <= roundedRating) {
        return "★"; // Full-star symbol
      } else {
        return "☆"; // Empty-star symbol
      }
    };
  
    //   if (roundedRating % 1 !== 0 && index === roundedRating + 0.5) {
    //     return "½";
    //   } else {
    //     return "☆"; // Otherwise, render an empty star
    //   }
    // }
  };

  private handleMouseEnter = (index: number): void => {
    this.setState({ hoverRating: index });
  };

  private handleMouseLeave = (): void => {
    this.setState({ hoverRating: 0 });
  };

  private handleRatingChange = (rating: number): void => {
    // Round the rating to the nearest half-star (0.5 increment)
    const roundedRating = Math.round(rating * 2) / 2;
    this.setState({ rating: roundedRating }, () => Streamlit.setComponentValue(roundedRating));
  };



  /** Focus handler for our "Click Me!" button. */
  private _onFocus = (): void => {
    this.setState({ isFocused: true })
  }

  /** Blur handler for our "Click Me!" button. */
  private _onBlur = (): void => {
    this.setState({ isFocused: false })
  }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(StarRatings)
