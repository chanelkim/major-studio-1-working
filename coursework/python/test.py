# HaoChe presentation of Python, Pandas Oct 19 2023

# There are sometimes useless system warnings (which is not an error).
# I put this codes to ignore errors
import warnings

warnings.filterwarnings("ignore")

# incorporating google drive with python

# PART 1
import pandas as pd

# CREATE A PANDAS DATAFRAME
# Create a simple dataset using dictionary
data = {
    "Name": ["John", "Anna", "Peter", "Sarah", "Nick"],
    "Location": ["New York", "Paris", "Berlin", "London", "Barcelona"],
    "Major": [
        "Graphic Design",
        "Data Visualization",
        "Design Technology",
        "Fashion Design",
        "Data Science",
    ],
    "Age": [28, 30, 27, 25, 26],
}

# print(data)

# Convert this dictionary to pandas dataframe
data_example = pd.DataFrame(data)

# Pandas dataframe allows pretty printing of dataframes
data_example

#
