# Image Analysis PCF
A Power App code component that leverages Azure AI Vision to extract text from Images for use in a model-driven app.


## Installation

Download the unmanaged/managed solution from the [Releases](https://github.com/ramarao9/power-platform-image-analysis-pcf/releases)


### Setting up the control

* Since the control processes images and extracts text, it is better to allocate an entire tab for the control on the target model-driven form. This would provide enough space to look at the image on one side and view and perform actions on the extracted text on the right side.
* Add a new Tab on the form and hide the label.
* Now add  a Multiline text field on the tab and add a new Component. If it's the first time the component is being used, you would need to click on Get more components

  <img width="534" alt="image" src="https://github.com/user-attachments/assets/9bd0243b-9a5a-40dd-8d5e-c3e1903936dd" />
* Next, add the Image Analysis component and bind the Entity Id column to the primary key attribute of your chosen table. For the Entity name specify it manually. In the below example, I specified the fields for the Account table

  <img width="1364" alt="image" src="https://github.com/user-attachments/assets/94882a71-501b-404b-b59a-5e15aa7022f8" />

* Once everything is configured and published, you should see the control below on your model-driven form for the respective table.

  <img width="1419" alt="image" src="https://github.com/user-attachments/assets/317f0879-c520-47b8-86b4-9ecdb7fc43b3" />

  

## Using the Control

Currently the control saves the text extracted but not the image data from which it was extracted. If this is something you would use in a real-project, feel free to create a issue with adiditonal details of the use case and I can look to enhance the control if it would work for other use cases. 

In the below example, the recognized text Work play is copied onto the Description field on the account table when the form is saved. However, when you refresh the form, the image is not preserved but the description field preserves the extracted text.


<img width="1447" alt="image" src="https://github.com/user-attachments/assets/f990a9d8-8d23-4f2f-a26e-65a059650c16" />

