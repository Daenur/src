const xml_data = `<?xml version='1.0' encoding='utf-8'?>
<?xml-stylesheet type="text/xsl" href="ACSPIXMT.xsl" ?>

<Library>
   <Books count='1'>
       <Book id='1'>
           <Name>Me Before You</Name>
           <Author>Jojo Moyes</Author>
       </Book>
   </Books>
   <Music count=1>
       <CD id='2'>
           <Name>Houses of the Holy</Name>
           <Artist>Led Zeppelin</Artist>
       </CD>
   </Music>
</Library>`

export default xml_data;


Import xml_data from 'path of your xml file';
var xml = new XMLParser().parseFromString(xml_data);