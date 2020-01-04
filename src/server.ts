import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {

    const { image_url } = req.query;

    console.log('image_url', image_url);
    if (!image_url) {
      res.status(400).send({message: 'Image_Url is required'});
    }
    else {
      filterImageFromURL(image_url).then((image) => {
        res.sendFile(image, () =>
              deleteLocalFiles([image])
            );
      }).catch(() => {
        res.sendStatus(422).send("Something bad happened: Unable to process input image.")
      })
    }
  });

  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();