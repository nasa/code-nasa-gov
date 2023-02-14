#pull down master branch
old_head=$(git rev-parse HEAD)
git pull https://github.com/nasa/code-nasa-gov.git
new_head=$(git rev-parse HEAD)
echo "$old_head : $new_head"

#run polymer build if there is any new commits
if [ $old_head = $new_head ]; then    
    echo "No new commits"
else    
    echo "New commits pulled from repo"    
    echo "running polymer build"    
    polymer build
    #copy build files into the root of the app    
    FILES='build/*'    
    for file in $FILES    
    do        
        echo "copying $file to root directory"        
        cp $file $PWD    
    done   

    FILES='build/bundled/*'    
    for file in $FILES    
    do        
        echo "copying $file to root directory"        
        cp -r $file $PWD    
    done
fi