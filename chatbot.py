from retriever import search_faq, search_products
from client import ask_llm

def handle_query(user_input):
    faq = search_faq(user_input)
    product = search_products(user_input)
    context = f"FAQ:\n{faq}\n\nPRODUCT:\n{product}"
    return ask_llm(context, user_input)