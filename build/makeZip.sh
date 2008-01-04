#
# This is the command line to create a zip file
#
cd ../..
zip -vr wireit.zip WireIt -x "*.svn*" "*.DS_Store*" "*build.sh" "*makeZip.sh" "*summary.txt" "*logo-wireit.xcf" "*generateDoc.sh"