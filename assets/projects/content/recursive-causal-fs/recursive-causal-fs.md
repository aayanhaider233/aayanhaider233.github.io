## Overview

This project implements a hierarchical analytical framework for schizophrenia classification using DNA methylation data. The framework combines differential methylation analysis, statistical and SHAP-based feature selection, machine learning, and causal discovery to progressively reduce a high-dimensional biological feature space into a compact, interpretable set of candidate biomarkers.

The central idea is to move through several biological levels:

```text
DNA methylation
      │
      ▼
    DMRs
      │
      ▼
    Genes
      │
      ▼
   Modules
      │
      ▼
Causal relationships
      │
      ▼
Compact feature set
```

---

## Approach

The analysis begins with quality-controlled Illumina 450K methylation data. Differentially methylated regions (DMRs) are identified using `DMRcate` and mapped to genes using genomic annotations and TSS regions.

Genes are then organized into co-expression modules using `WGCNA`. Causal discovery is performed hierarchically using `DirectLiNGAM`, progressing from module-level relationships to individual genes and finally back to their associated DMRs.

At each level, feature selection progressively reduces the search space while retaining biologically and causally informative features.

```text
DMRs
 │
 ├── Statistical / SHAP selection
 │
 ▼
Genes
 │
 ▼
WGCNA modules
 │
 ▼
Module-level causal discovery
 │
 ▼
Gene-level causal discovery
 │
 ▼
Selected genes
 │
 ▼
Associated DMRs
 │
 ▼
DMR-level causal discovery
```

---

## Classification

The resulting causal feature sets are evaluated using two classification models:

* Logistic Regression
* Random Forest

The causal feature sets are compared against statistical and SHAP-derived baseline feature sets using held-out test data.

Performance is evaluated using:

* Accuracy
* Precision
* Recall
* F1 score
* F2 score
* ROC-AUC

Paired bootstrap resampling is used to compare model performance across feature configurations.

---

## Results

The final integrated feature set achieves classification performance comparable to substantially larger statistical and SHAP-based feature sets while using dramatically fewer features.

More importantly, the hierarchical approach provides a route from statistical association to causally structured and biologically interpretable features, allowing the selected methylation regions to be examined in the context of their associated genes, modules, and inferred disease relationships.

