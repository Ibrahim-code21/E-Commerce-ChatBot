import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

faq_df = pd.read_csv("data/faq_data.csv")
products_df = pd.read_csv("data/products_data.csv")

faq_vectorizer = TfidfVectorizer()
product_vectorizer = TfidfVectorizer()

faq_vectors = faq_vectorizer.fit_transform(faq_df['Question'].astype(str))
product_vectors = product_vectorizer.fit_transform(
    products_df['Title'].astype(str) + " " + products_df['Description'].astype(str)
)

def search_faq(query):
    query_vec = faq_vectorizer.transform([query])
    scores = cosine_similarity(query_vec, faq_vectors)
    return faq_df.iloc[scores.argmax()]['Answer']

def search_products(query):
    query_vec = product_vectorizer.transform([query])
    scores = cosine_similarity(query_vec, product_vectors)
    p = products_df.iloc[scores.argmax()]
    return f"{p['Title']} - ${p['Price']}\n{p['Description']}"