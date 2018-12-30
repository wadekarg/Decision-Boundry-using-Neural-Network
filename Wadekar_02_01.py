#Gajanan Wadekar  -- Project for Neural Netwrok

#importing all reqquired libraries
import random
import sys
if sys.version_info[0] < 3:
    import Tkinter as tk
else:
    import tkinter as tk
import matplotlib
matplotlib.use('TkAgg')
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
import numpy as np

#Main window is the main class
class MainWindow(tk.Tk):
    """
    This class creates and controls the main window frames and widgets
    Gajanan Wadekar 09-06-2018
    """

    def __init__(self, debug_print_flag=False):
        tk.Tk.__init__(self)
        self.debug_print_flag = debug_print_flag
        self.master_frame = tk.Frame(self)
        self.master_frame.grid(row=0, column=0, sticky=tk.N + tk.E + tk.S + tk.W)
        self.rowconfigure(0, weight=1, minsize=500)
        self.columnconfigure(0, weight=1, minsize=500)
        # set the properties of the row and columns in the master frame
        self.master_frame.rowconfigure(2, weight=10, minsize=400, uniform='xx')
        self.master_frame.rowconfigure(3, weight=1, minsize=10, uniform='xx')
        self.master_frame.columnconfigure(0, weight=1, minsize=200, uniform='xx')
        self.master_frame.columnconfigure(1, weight=1, minsize=200, uniform='xx')
        # create all the widgets

        self.tool_bar = ToolBar(self, self.master_frame)
        self.left_frame = tk.Frame(self.master_frame)
        self.status_bar = StatusBar(self, self.master_frame, bd=1, relief=tk.SUNKEN)
        # Arrange the widgets

        self.tool_bar.grid(row=1, columnspan=2, sticky=tk.N + tk.E + tk.S + tk.W)
        self.left_frame.grid(row=2, columnspan=2, sticky=tk.N + tk.E + tk.S + tk.W)
        self.status_bar.grid(row=3, columnspan=2, sticky=tk.N + tk.E + tk.S + tk.W)
        # Create an object for plotting graphs in the left frame
        self.display_activation_functions = MainFrame(self, self.left_frame, debug_print_flag=self.debug_print_flag)
        # Create an object for displaying graphics in the right frame


class ToolBar(tk.Frame):
    def __init__(self, root, master, *args, **kwargs):
        tk.Frame.__init__(self, master, *args, **kwargs)
        self.root = root
        self.master = master
        self.var_filename = tk.StringVar()
        self.var_filename.set('')

class StatusBar(tk.Frame):
    def __init__(self, root, master, *args, **kwargs):
        tk.Frame.__init__(self, master, *args, **kwargs)
        self.label = tk.Label(self)
        self.label.grid(row=0, sticky=tk.N + tk.E + tk.S + tk.W)

    def set(self, format, *args):
        self.label.config(text=format % args)
        self.label.update_idletasks()

    def clear(self):
        self.label.config(text="")
        self.label.update_idletasks()


class MainFrame:
    """
    This class creates and controls the widgets and figures in the left frame which
    are used to display the activation functions.
    Gajanan Wadekar 09-06-2018
    """

    def __init__(self, root, master, debug_print_flag=False):
        self.master = master
        self.root = root
        #########################################################################
        #  Set up the constants and default values
        #########################################################################
        self.xmin = -10
        self.xmax = 10
        self.ymin = -10
        self.ymax = 10
        self.input_weight1 = 1
        self.input_weight2 = 1
        self.bias = 0.0
        self.activation_type = "Symmetrical Hard limit"
        self.x1 = 0
        self.y1 = 0
        self.x2 = 0
        self.y2 = 0
        self.x3 = 0
        self.y3 = 0
        self.x4 = 0
        self.y4 = 0
        #########################################################################
        #  Set up the plotting frame and controls frame
        #########################################################################
        master.rowconfigure(0, weight=10, minsize=500)
        master.columnconfigure(0, weight=1)
        self.plot_frame = tk.Frame(self.master, borderwidth=10, relief=tk.SUNKEN)
        self.plot_frame.grid(row=0, column=0, columnspan=2, sticky=tk.E + tk.W + tk.N + tk.S)
        self.figure = plt.figure("")
        self.axes = self.figure.add_axes([0.15, 0.15, 0.6, 0.8])
        # self.axes = self.figure.add_axes()
        self.axes = self.figure.gca()
        self.axes.set_xlabel('Input')
        self.axes.set_ylabel('Output')
        # self.axes.margins(0.5)
        self.axes.set_title("")
        plt.xlim(self.xmin, self.xmax)
        plt.ylim(self.ymin, self.ymax)
        self.canvas = FigureCanvasTkAgg(self.figure, master=self.plot_frame)
        self.plot_widget = self.canvas.get_tk_widget().pack(fill=tk.BOTH)
        # Create a frame to contain all the controls such as sliders, buttons, ...
        self.controls_frame = tk.Frame(self.master)
        self.controls_frame.grid(row=1, column=0, sticky=tk.N)
        #########################################################################
        #  Set up the control widgets such as sliders and selection boxes
        #########################################################################
        self.input_weight_slider1 = tk.Scale(self.controls_frame, variable=tk.DoubleVar(), orient=tk.HORIZONTAL,
                                            from_=-10.0, to_=10.0,width = 30, resolution=0.01, bg="#DDDDDD",
                                            activebackground="#FF0000", highlightcolor="#00FFFF", label="First Weight(W1)",
                                            command=lambda event: self.input_weight_slider_callback1())
        self.input_weight_slider1.set(self.input_weight1)
        self.input_weight_slider1.bind("<ButtonRelease-1>", lambda event: self.input_weight_slider_callback1())
        self.input_weight_slider1.grid(row=0, column=0, sticky=tk.N + tk.E + tk.S + tk.W)

        self.input_weight_slider2 = tk.Scale(self.controls_frame, variable=tk.DoubleVar(), orient=tk.HORIZONTAL,
                                            from_=-10.0, to_=10.0,width = 30, resolution=0.01, bg="#DDDDDD",
                                            activebackground="#FF0000", highlightcolor="#00FFFF", label="Second Weight(W2)",
                                            command=lambda event: self.input_weight_slider_callback2())
        self.input_weight_slider2.set(self.input_weight2)
        self.input_weight_slider2.bind("<ButtonRelease-1>", lambda event: self.input_weight_slider_callback2())
        self.input_weight_slider2.grid(row=0, column=1, sticky=tk.N + tk.S + tk.W)

        self.bias_slider = tk.Scale(self.controls_frame, variable=tk.DoubleVar(),width = 30,orient=tk.HORIZONTAL, from_=-10.0,
                                    to_=10.0, resolution=0.01, bg="#DDDDDD", activebackground="#FF0000",
                                    highlightcolor="#00FFFF", label="Bias",
                                    command=lambda event: self.bias_slider_callback())
        self.bias_slider.set(self.bias)
        self.bias_slider.bind("<ButtonRelease-1>", lambda event: self.bias_slider_callback())
        self.bias_slider.grid(row=0, column=2, sticky=tk.N + tk.E + tk.S + tk.W)

        self.input_generate_button = tk.Button(self.controls_frame,text='Create random data', width=20, command=lambda:self.Generate_random_input_callback)
        self.input_generate_button.bind("<ButtonRelease-1>", lambda event: self.Generate_random_input_callback())
        self.input_generate_button.grid(row=0, column=3)

        self.learn_weight_button = tk.Button(self.controls_frame,text='Train', width=20, command=lambda:self.Learn_new_weight_callback())
        self.learn_weight_button.bind("<ButtonRelease-2>", lambda event: self.Learn_new_weight_callback())
        self.learn_weight_button.grid(row=0, column=4)
        #self.input_generate_button.set()
        #########################################################################
        #  Set up the frame for drop down selection
        #########################################################################
        self.label_for_activation_function = tk.Label(self.controls_frame, text="Activation Function Type:")
        self.label_for_activation_function.grid(row=0, column=5, sticky=tk.N + tk.E + tk.S + tk.W)
        self.activation_function_variable = tk.StringVar()
        self.activation_function_dropdown = tk.OptionMenu(self.controls_frame, self.activation_function_variable,
                                                          "Symmetrical Hard limit", "Linear","Hyperbolic Tangent", command=lambda
                event: self.activation_function_dropdown_callback())
        self.activation_function_variable.set("Symmetrical Hard limit")
        self.activation_function_dropdown.grid(row=0, column=6, sticky=tk.N + tk.E + tk.S + tk.W)
        self.canvas.get_tk_widget().bind("<ButtonPress-1>", self.left_mouse_click_callback)
        self.canvas.get_tk_widget().bind("<ButtonPress-1>", self.left_mouse_click_callback)
        self.canvas.get_tk_widget().bind("<ButtonRelease-1>", self.left_mouse_release_callback)
        self.canvas.get_tk_widget().bind("<B1-Motion>", self.left_mouse_down_motion_callback)
        self.canvas.get_tk_widget().bind("<ButtonPress-3>", self.right_mouse_click_callback)
        self.canvas.get_tk_widget().bind("<ButtonRelease-3>", self.right_mouse_release_callback)
        self.canvas.get_tk_widget().bind("<B3-Motion>", self.right_mouse_down_motion_callback)
        self.canvas.get_tk_widget().bind("<Key>", self.key_pressed_callback)
        self.canvas.get_tk_widget().bind("<Up>", self.up_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Down>", self.down_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Right>", self.right_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Left>", self.left_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Shift-Up>", self.shift_up_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Shift-Down>", self.shift_down_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Shift-Right>", self.shift_right_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("<Shift-Left>", self.shift_left_arrow_pressed_callback)
        self.canvas.get_tk_widget().bind("f", self.f_key_pressed_callback)
        self.canvas.get_tk_widget().bind("b", self.b_key_pressed_callback)
    def key_pressed_callback(self, event):
        self.root.status_bar.set('%s', 'Key pressed')

    def up_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Up arrow was pressed")

    def down_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Down arrow was pressed")

    def right_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Right arrow was pressed")

    def left_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Left arrow was pressed")

    def shift_up_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Shift up arrow was pressed")

    def shift_down_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Shift down arrow was pressed")

    def shift_right_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Shift right arrow was pressed")

    def shift_left_arrow_pressed_callback(self, event):
        self.root.status_bar.set('%s', "Shift left arrow was pressed")

    def f_key_pressed_callback(self, event):
        self.root.status_bar.set('%s', "f key was pressed")

    def b_key_pressed_callback(self, event):
        self.root.status_bar.set('%s', "b key was pressed")

    def left_mouse_click_callback(self, event):
        self.root.status_bar.set('%s', 'Left mouse button was clicked. ' + 'x=' + str(event.x) + '   y=' + str(
            event.y))
        self.x = event.x
        self.y = event.y
        self.canvas.focus_set()

    def left_mouse_release_callback(self, event):
        self.root.status_bar.set('%s',
                                 'Left mouse button was released. ' + 'x=' + str(event.x) + '   y=' + str(event.y))
        self.x = None
        self.y = None

    def left_mouse_down_motion_callback(self, event):
        self.root.status_bar.set('%s', 'Left mouse down motion. ' + 'x=' + str(event.x) + '   y=' + str(event.y))
        self.x = event.x
        self.y = event.y

    def right_mouse_click_callback(self, event):
        self.root.status_bar.set('%s', 'Right mouse down motion. ' + 'x=' + str(event.x) + '   y=' + str(event.y))
        self.x = event.x
        self.y = event.y

    def right_mouse_release_callback(self, event):
        self.root.status_bar.set('%s',
                                 'Right mouse button was released. ' + 'x=' + str(event.x) + '   y=' + str(event.y))
        self.x = None
        self.y = None

    def right_mouse_down_motion_callback(self, event):
        self.root.status_bar.set('%s', 'Right mouse down motion. ' + 'x=' + str(event.x) + '   y=' + str(event.y))
        self.x = event.x
        self.y = event.y

    def left_mouse_click_callback(self, event):
        self.root.status_bar.set('%s', 'Left mouse button was clicked. ' + 'x=' + str(event.x) + '   y=' + str(
            event.y))
        self.x = event.x
        self.y = event.y


    def display_activation_function(self):
        # creating random points between -10 and +10
        u1 = random.randint(-10, 10)
        v1 = random.randint(-10, 10)
        u2 = random.randint(-10, 10)
        v2 = random.randint(-10, 10)
        u3 = random.randint(-10, 10)
        v3 = random.randint(-10, 10)
        u4 = random.randint(-10, 10)
        v4 = random.randint(-10, 10)

        self.x1 = u1
        self.y1 = v1
        self.x2 = u2
        self.y2 = v2
        self.x3 = u3
        self.y3 = v3
        self.x4 = u4
        self.y4 = v4

        # plotting the generated points by categorizing them
        self.axes.cla()
        self.axes.set_xlabel('Input')
        self.axes.set_ylabel('Output')
        self.axes.plot(u1, v1, 'xw')
        self.axes.plot(u2, v2, 'xw')
        self.axes.plot(u3, v3, 'yo')
        self.axes.plot(u4, v4, 'yo')
        self.axes.xaxis.set_visible(True)

        self.draw_boundry_line()

    def learn_new_weight(self):
        for each in range (1,100):
            # for point 1 P1(x1,y1) target is 1
            net_value = self.input_weight1 * self.x1 + self.input_weight2 * self.y1 + self.bias
            activation = self.calculate_activation_function(net_value, self.activation_type)
            if activation == 1:
                pass
            else:
                self.input_weight1 = self.input_weight1 + (1 - activation) * self.x1
                self.input_weight2 = self.input_weight2 + (1 - activation) * self.y1
                self.bias = self.bias + (1-activation)
            # for point 1 P1(x2,y2) target is 1
            net_value = self.input_weight1 * self.x2 + self.input_weight2 * self.y2 + self.bias
            activation = self.calculate_activation_function(net_value, self.activation_type)
            if activation == 1:
                pass
            else:
                self.input_weight1 = self.input_weight1 + (1 - activation) * self.x2
                self.input_weight2 = self.input_weight2 + (1 - activation) * self.y2
                self.bias = self.bias + (1-activation)
            # for point 1 P1(x3,y3) target is -1
            net_value = self.input_weight1 * self.x3 + self.input_weight2 * self.y3 + self.bias
            activation = self.calculate_activation_function(net_value, self.activation_type)
            if activation == -1:
                pass
            else:
                self.input_weight1 = self.input_weight1 + (-1 - activation) * self.x3
                self.input_weight2 = self.input_weight2 + (-1 - activation) * self.y3
                self.bias = self.bias + (1-activation)
            # for point 1 P1(x4,y4) target is -1
            net_value = self.input_weight1 * self.x4 + self.input_weight2 * self.y4 + self.bias
            activation = self.calculate_activation_function(net_value, self.activation_type)
            if activation == -1:
                pass
            else:
                self.input_weight1 = self.input_weight1 + (-1 - activation) * self.x4
                self.input_weight2 = self.input_weight2 + (-1 - activation) * self.y4
                self.bias = self.bias + (1-activation)
        self.draw_boundry_line()


    def calculate_activation_function(self,net_value, type='Symmetrical Hard limit'):
        if type == 'Symmetrical Hard limit':
            if net_value >= 0:
                activation = 1
            else:
                activation = -1
        elif type == "Linear":
            activation = net_value
        elif type == "Hyperbolic Tangent":
            activation = ((np.exp( net_value ) - np.exp( -net_value )) / (np.exp( net_value ) + np.exp( -net_value )))
        return activation


    def draw_boundry_line(self):

        #for updating values into graph while training
        self.input_weight_slider1.set(self.input_weight1)
        self.input_weight_slider2.set(self.input_weight2)
        self.bias_slider.set(self.bias)

        #setting resolution of the plot, as we need resolution of 100x100
        resolution = 100
        xs = np.linspace(-10., 10., resolution)
        ys = np.linspace(-10., 10., resolution)
        xx, yy = np.meshgrid(xs, ys)
        zz = self.input_weight1 * xx + self.input_weight2 * yy + self.bias      #Equation of decision boundary
        zz[zz > 0] = 1
        zz[zz < 0] = -1
        self.axes.pcolormesh(xs, ys, zz, cmap='RdYlGn')

        plt.xlim(self.xmin, self.xmax)
        plt.ylim(self.ymin, self.ymax)
        plt.title(self.activation_type)
        self.canvas.draw()


    # callback methods for sliders, buttons, and drop downlists
    def input_weight_slider_callback1(self):
        self.input_weight1 = np.float(self.input_weight_slider1.get())
        self.draw_boundry_line()

    def input_weight_slider_callback2(self):
        self.input_weight2 = np.float(self.input_weight_slider2.get())
        self.draw_boundry_line()

    def Generate_random_input_callback(self):
        self.bias = 0
        self.input_weight1 = 1
        self.input_weight2 = 1
        self.display_activation_function()

    def Learn_new_weight_callback(self):
        self.learn_new_weight()

    def bias_slider_callback(self):
        self.bias = np.float(self.bias_slider.get())
        self.draw_boundry_line()

    def activation_function_dropdown_callback(self):
        self.activation_type = self.activation_function_variable.get()
        self.draw_boundry_line()



def close_window_callback(root):
    if tk.messagebox.askokcancel("Quit", "Do you really wish to quit?"):
        root.destroy()


main_window = MainWindow(debug_print_flag=False)
# main_window.geometry("500x500")
main_window.wm_state('zoomed')
main_window.title('Assignment_02 --  Wadekar')
main_window.minsize(800, 600)
main_window.protocol("WM_DELETE_WINDOW", lambda root_window=main_window: close_window_callback(root_window))
main_window.mainloop()
