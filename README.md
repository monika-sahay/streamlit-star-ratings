# streamlit-custom-component

Streamlit component that allows you to add star ratings components in your streamlit application

## Installation instructions

```sh
pip install streamlit-star-ratings
```

## Usage instructions

```python
import streamlit as st

from star_ratings import star_ratings

ratings = star_ratings("", numStars=5)

st.markdown("You've given %s ratings!" % int(ratings if ratings else 0))
```