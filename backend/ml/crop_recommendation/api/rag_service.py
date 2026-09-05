import os
import sys
import math
import re
from typing import List, Dict, Any, Optional

API_DIR = os.path.dirname(os.path.abspath(__file__))
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

try:
    from .rag_data import AGRONOMIC_KNOWLEDGE_BASE
except Exception:
    import rag_data as rd_mod
    AGRONOMIC_KNOWLEDGE_BASE = rd_mod.AGRONOMIC_KNOWLEDGE_BASE


class AgriculturalRAGService:
    _instance: Optional["AgriculturalRAGService"] = None

    def __init__(self):
        self.documents = AGRONOMIC_KNOWLEDGE_BASE
        self._build_index()

    @classmethod
    def get_instance(cls) -> "AgriculturalRAGService":
        if cls._instance is None:
            cls._instance = AgriculturalRAGService()
        return cls._instance

    def _tokenize(self, text: str) -> List[str]:
        """Cleans and tokenizes text into lower-cased alphanumeric words."""
        return [w for w in re.findall(r"\b[a-zA-Z0-9_\-]{2,}\b", text.lower()) if len(w) > 2]

    def _build_index(self):
        """Builds TF-IDF vector representations for document collection."""
        self.doc_vectors = []
        self.idf = {}
        df = {}
        total_docs = len(self.documents)

        # 1. Compute document frequencies
        doc_tokens_list = []
        for doc in self.documents:
            combined_text = f"{doc['title']} {' '.join(doc['keywords'])} {doc['content']}"
            tokens = set(self._tokenize(combined_text))
            doc_tokens_list.append(self._tokenize(combined_text))
            for t in tokens:
                df[t] = df.get(t, 0) + 1

        # 2. Compute IDF
        for t, freq in df.items():
            self.idf[t] = math.log((total_docs + 1.0) / (freq + 0.5)) + 1.0

        # 3. Compute TF-IDF vector for each doc
        for tokens in doc_tokens_list:
            tf = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            n = len(tokens) or 1
            vec = {t: (cnt / n) * self.idf.get(t, 1.0) for t, cnt in tf.items()}
            # Normalize vector
            norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
            self.doc_vectors.append({t: v / norm for t, v in vec.items()})

    def search(self, query: str, top_k: int = 3, min_score: float = 0.08) -> List[Dict[str, Any]]:
        """
        Retrieves top_k most relevant knowledge articles for a user query.
        """
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        # Vectorize query
        q_tf = {}
        for t in query_tokens:
            q_tf[t] = q_tf.get(t, 0) + 1
        qn = len(query_tokens) or 1
        q_vec = {t: (cnt / qn) * self.idf.get(t, 1.0) for t, cnt in q_tf.items()}
        q_norm = math.sqrt(sum(v * v for v in q_vec.values())) or 1.0
        q_vec = {t: v / q_norm for t, v in q_vec.items()}

        # Compute cosine similarity against all documents
        scored = []
        q_lower = query.lower()
        is_disease_query = any(w in q_lower for w in ["spot", "spots", "yellow", "blight", "rust", "aphid", "pest", "disease", "rot", "curling", "fungus", "keeda", "rog"])
        is_fertilizer_query = any(w in q_lower for w in ["fertilizer", "urea", "dap", "npk", "potash", "deficiency", "dose"])
        is_scheme_query = any(w in q_lower for w in ["scheme", "pm-kisan", "pmfby", "kcc", "card", "yojana", "subsidy"])

        for i, doc_vec in enumerate(self.doc_vectors):
            score = 0.0
            for t, q_val in q_vec.items():
                if t in doc_vec:
                    score += q_val * doc_vec[t]

            doc = self.documents[i]
            category = doc.get("category", "")

            # Category boost based on query intent
            if is_disease_query and category == "plant_pathology":
                score += 0.35
            elif is_fertilizer_query and (category == "nutrient_deficiency" or category == "soil_management"):
                score += 0.30
            elif is_scheme_query and category == "government_scheme":
                score += 0.35

            # Bonus for exact keyword matches in title/keywords
            for kw in doc.get("keywords", []):
                if kw in q_lower:
                    score += 0.20

            if score >= min_score:
                scored.append((score, doc))

        # Sort descending by score
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]


# Global singleton
rag_service = AgriculturalRAGService.get_instance()
