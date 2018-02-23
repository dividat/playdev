# Create the diagrams. Requires graphviz and mscgen


all: architecture.png egi.png

architecture.png: architecture.dot
	dot -Tpng -oarchitecture.png architecture.dot

egi.png: egi.msc
	mscgen -T png -o egi.png egi.msc


