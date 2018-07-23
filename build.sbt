name := "eCommerce"

version := "1.0"

scalaVersion := "2.11.0"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)     

play.Project.playScalaSettings
