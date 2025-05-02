from setuptools import setup, find_packages

setup(
    name="mathsprout",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "supabase==2.3.4",
        "pandas==2.2.1",
        "matplotlib==3.8.3",
        "python-dotenv==1.0.1",
        "streamlit==1.12.0",
        "plotly==5.18.0",
        "seaborn==0.13.2",
        "numpy==1.26.4",
        "scikit-learn==1.4.0",
    ],
)
