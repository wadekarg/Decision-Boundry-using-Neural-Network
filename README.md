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
			
The activation/transfer functions used are, linear, sigmoid, hard limit. The activation functions are also modified depending upon required output. Some of them are shown below,


 

																
		
