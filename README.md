#Neural_Network_decision_coundry_using_single_neuron

The project is about the implementation of Perceptron Learning rule to draw a decision boundary between the points belonging to different classes.

The task:

  1. Create 4 random point for 2 classes and plot them on the graph using different points.
  2. Draw a decision boundary between them if these points are linearly separable.
  3. Color the input space to green which corresponds to positive output
  4. Color the input space to red which corresponds to negative output

for training the neuron the perceptron learning rule is used.
		the equation of line is

	y=Wx+b where y: output
			w: weight
			b: bias

The Perceptron learning rule is,

		e = y_target – y_actual
		W_new = W_old +(e*x)
		b_new = b_old + e

		x: input
		e: error
 for single neuron, single input the newtwork will be as below,

 ![alt text](/images/single_neuron.png)

The activation/transfer functions used are, linear, sigmoid, hard limit. The activation functions are also modified depending upon required output. Some of them are shown below,

![alt text](/images/activation%20functions.PNG)


The for 2 classes are generated using random.randint
The target output is given for the points randomly as +1 for positive class and -1 for negative class.

![alt text](/images/graph_plot_1.PNG)

The graphic window is created using tkinter and matplotlib.
There are 3 sliders for w1, w2 and bias.
Two buttons are for creating a random data points and for another is for training the network.
The dropdown list is for selecting the activation/transfer functions.

For default,
w1=1
w2=1
b=0

therefore the decision boundary is shown as above and data points are created as shown,

![alt text](/images/graph_plot_2.PNG)

The white cross(x) are the points belongs to positive class and yellow dots are of negative class.

After pressing the button train, the decision boundary gets modified as shown below,

The weights and bias will also get updated while training.

![alt text](/images/graph_plot_3.PNG)

The linearly inseparable data can not be classified by using perceptron learning rule. As the data is getting generated randomly is it possible that sometime data points are linearly inseparable.

![alt text](/images/graph_plot_4.PNG)

While using the linear transfer function, the weights and bias get updated to large number due to which linear transfer function doesn't work as required. Here hard limit and sigmoid works well.

![alt text](/images/error.PNG)


How to run: Run the wadekar_02_01.py


References:
1. The transfer function image is taken from Neural Network Design Book by Martin T. Hagan

---

# The Perceptron Lab

An interactive playground to explore how perceptrons create decision boundaries. Built with **Angular 19** and styled as a hand-drawn notebook/sketch aesthetic using **rough.js**.

**Live Demo:** https://wadekarg.github.io/Decision-Boundry-using-Neural-Network/#/

## Features

- **4 Interactive Learn Chapters** — from "What is a Perceptron?" to the learning rule
- **Interactive Lab** — add data points, adjust weights, pick activation functions, watch training
- **4 Activation Functions** — Hard Limit, Symmetrical Hard Limit, Linear, Tanh
- **4 Dataset Presets** — linearly separable, XOR, clusters, circular
- **Step-by-step Training** — view every weight update with full KaTeX math breakdowns
- **Hand-drawn Visuals** — rough.js canvas rendering for boundary lines, data points, and charts

## Tech Stack

| Layer | Technology | Why |
|:------|:-----------|:----|
| **Framework** | ![Angular](https://img.shields.io/badge/Angular_19-DD0031?style=flat-square&logo=angular&logoColor=white) | Standalone components, signals API, new control flow — no NgModules boilerplate |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Full type safety across the perceptron engine, training loop, and UI |
| **Styling** | ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white) | Custom hand-drawn notebook theme — no CSS framework needed |
| **Canvas** | ![rough.js](https://img.shields.io/badge/rough.js-4A4A4A?style=flat-square) | Sketch aesthetic for decision boundary lines, data points, and training charts |
| **Math** | ![KaTeX](https://img.shields.io/badge/KaTeX-008080?style=flat-square) | Beautiful equation rendering in the live math and step breakdown panels |
| **Deploy** | ![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white) | Automatic via GitHub Actions on push to `master`, hash routing for SPA |

## Origin

Based on a Neural Network class assignment at UT Arlington (Dr. Farhad Kamangar). Interactive web application vibe-coded in March 2026 by **Gajanan Wadekar**.

