var Campground = require('./models/campgrounds');
var Comment = require('./models/comments');


var data = [
    {
        name: 'Mount Abu', 
        image:'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Bir Biling', 
        image:'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Kasauli', 
        image:'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Manali', 
        image:'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        description: 'blah blah blah'
    }
]


function seedDB(){
    // Remove all the Campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log('Campgrounds were removed');
        // Create some seed Campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campgound){
                if (err){
                    console.log(err);
                } else{
                    console.log('Campgound Created');
                    Comment.create({
                        text: 'These are some nice places',
                        author: 'Cheeku'
                    }, function(err, comment){
                        if (err){
                            console.log(err);
                        } else{
                            campgound.comments.push(comment);
                            campgound.save();
                            console.log('Comments Created');
                        }
                    });

                }
            })
        });
    });
}



module.exports = seedDB;