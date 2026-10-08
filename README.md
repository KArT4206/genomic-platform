# Genomic Platform (front-end edition)

An earlier, front-end-only version of the DNA analysis platform: a React single-page app with Firebase sign-in where users submit a DNA sequence, run **70 motif and pattern tests** on it, and keep a history of results. Admins can review all users and results and manage roles.

> This repository documents the project (description, design, screenshots). The source code lives in the private repository `genomic-platform-code`. The full version with variant annotation and a machine-learning model is described in `Web-Based-DNA-Sequence-Analysis-and-Disease-Prediction-System-with-Administrative-Dashboard`.

## Screenshot

The analysis engine behind the "Analyze" button, run on a 63 bp test sequence (25 of the 70 tests match):

![Pattern tests](docs/images/tests.png)

## What it does
- **Sign up / sign in** with Firebase Authentication; the first screen is an animated "Loading Genomic Platform..." check of the user's role.
- **Analyse** a pasted sequence or an uploaded FASTA file.
- **70 pattern tests** in categories such as Promoter (TATA box, CAAT box, GC box), Regulatory (CRE, NF-kB, Sp1), Splicing (donor, acceptor, branch point), Transcript (poly-A, polyadenylation signal), Replication, Codons (start/stop), miRNA seed and secondary-structure motifs. Each result lists the matched text and its position.
- **Results history** per user, stored in Firestore.
- **Admin dashboard** listing all users and results, plus an **admin role manager** to promote or demote accounts.

## How it works
1. `App.jsx` listens to Firebase `onAuthStateChanged`, reads the user's role from Firestore and routes to the user or admin dashboard.
2. `dnaTests.js` defines every test as `{name, category, pattern}`; `runAllTests(sequence)` upper-cases the sequence, runs each regular expression globally and returns `{testName: ["match@index", ...]}`.
3. The dashboard shows the counts, and saves the sequence and summary to the `results` collection.
4. `AdminDashboard` queries `results` (newest first) and `users`; `AdminRoleManager` updates a user's `role` field.

## Tech stack
React 18, Tailwind CSS, Framer Motion, Recharts, Firebase Authentication and Firestore.
